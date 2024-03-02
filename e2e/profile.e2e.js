const request = require('supertest');
const createApp = require('../src/app');
const models = require('../src/db/models/user.model');
const { upSeed, downSeed } = require('./utils/seed');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('GET /my-user', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: '123456',
      };
      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return 401', async () => {
      const accessToken = '123123';
      const { statusCode } = await api.get(`/api/v1/profile/my-user`).set({
        Authorization: `Bearer ${accessToken}`,
      });
      expect(statusCode).toEqual(401);
    });

    test('should return a user with an valid access token', async () => {
      const user = await models.User.findByPk('1');
      const { statusCode, body } = await api
        .get(`/api/v1/profile/my-user`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
      expect(statusCode).toEqual(200);
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken = null;
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
