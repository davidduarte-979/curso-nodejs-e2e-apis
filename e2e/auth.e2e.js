const request = require('supertest');
const createApp = require('../src/app');
const models = require('../src/db/models/user.model');
const { upSeed, downSeed } = require('./utils/umzug');

const mockSendEmail = jest.fn();

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: mockSendEmail,
      };
    }),
  };
});

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

  describe('POST /login', () => {
    test('should return a 401', async () => {
      const inputData = {
        email: 'emailfake@gmasil.com',
        password: 'P@ssw0rd',
      };
      const { statusCode } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      expect(statusCode).toBe(401);
    });

    test('should return 200', async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: '123456',
      };
      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      expect(statusCode).toBe(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.email).toEqual(user.email);
      expect(body.user.password).toBeUndefined();
    });
  });

  describe('POST / recovery ', () => {
    beforeAll(() => {
      mockSendEmail.mockClear();
    });

    test('should return 401', async () => {
      const inputData = { email: 'email@fake.com' };
      const { statusCode } = await api
        .post('/api/v1/auth/recovery')
        .send(inputData);
      expect(statusCode).toBe(401);
    });

    test('should send email', async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
      };
      mockSendEmail.mockResolvedValue(true);
      const { statusCode, body } = await api
        .post('/api/v1/auth/recovery')
        .send(inputData);

      expect(statusCode).toBe(200);
      expect(body.message).toEqual('mail sent');
      expect(mockSendEmail).toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    server.close();
    await downSeed();
  });
});
