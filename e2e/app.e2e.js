const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');

describe('test for app', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
   app = createApp();
   server = app.listen(9000);
   api = request(app);
  });

  test('GET /hello', async () => {
    const rta = await api.get('/hello');
    expect(rta).toBeTruthy();
    expect(rta.statusCode).toEqual(200);
    expect(rta.body.name).toEqual('Jesus');
    expect(rta.headers['content-type']).toMatch(/json/);
  });

  describe('GET /new-route', () => {

    test('should return 401', async () => {
      const { statusCode } = await api.get('/new-route');
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with invalid apiKey', async () => {
      const { statusCode } = await api.get('/new-route').set({
        api: '1234'
      });
      expect(statusCode).toEqual(401);
    });

    test('should return 200', async () => {
      const { statusCode } = await api.get('/new-route').set({
        api: config.apiKey
      });
      expect(statusCode).toEqual(200);
    });
  })


  afterAll(() => {
    server.close()
  });
})

