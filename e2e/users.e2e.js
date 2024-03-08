const request = require('supertest');
const createApp = require('../src/app');
const models = require('../src/db/models/user.model');
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('GET /users/{id}', () => {
    test('should return a user', async () => {
      const inputId = '1';
      const { statusCode } = await api.get(`/api/v1/users/${inputId}`);
      expect(statusCode).toEqual(200);
    });
  });

  describe('POST /users', () => {
    test('should return a 400 bad request with a invalid pasword', async () => {
      const inputData = {
        email: 'david@test.com',
        password: '-----',
      };
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return a 400 bad request with an invalid email', async () => {
      const inputData = {
        email: '-------',
        password: 'P@ssw0rd',
      };
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/email/);
    });

    test('should return a new user', async () => {
      const inputData = {
        email: 'test@test.com',
        password: 'P@ssw0rd',
      };
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      expect(statusCode).toBe(201);
      const user = await models.User.findByPk(body.id);
      expect(user).toBeTruthy();
      expect(user.role).toEqual('admin');
      expect(user.email).toEqual(inputData.email);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
