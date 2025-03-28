// Write your tests here
const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig')
const { generateToken } = require('./auth/token_generator')

test('sanity', () => {
  expect(true).toBe(true)
})

describe('Authentication Endpoints', () => {
  beforeAll(async () => {

    await db.migrate.rollback();
    await db.migrate.latest();
  });


  afterAll(async () => {

    await db.destroy();
  });

  describe('[POST] /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = { username: 'testuser', password: 'testpassword' };

      const res = await request(server)
        .post('/api/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toBeTruthy()
      expect(typeof res.body).toBe('object')
    });

    it('should return 400 if username or password is missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "username and password required" });
    });
  });

  describe('[POST] /api/auth/login', () => {
    it('should login an existing user', async () => {
      const existingUser = { username: 'existinguser', password: 'testpassword' };
      await request(server).post('/api/auth/register').send(existingUser);

      const token = generateToken(existingUser)
      const res = await request(server)
        .post('/api/auth/login')
        .set('Authorization', token)
        .send(existingUser);

      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy()
      expect(res.body).toHaveProperty('message', 'welcome, existinguser');
      expect(res.body).toHaveProperty('token');

    });

    it('should return 401 if username or password is incorrect', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "invalid credentials" });
    });

  });

  describe('[GET] /api/jokes', () => {
    it('should return jokes when authenticated', async () => {
      const existingUser = { username: 'existinguser', password: 'testpassword' };
      await request(server).post('/api/auth/register').send(existingUser);

      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send(existingUser);

      const token = loginResponse.body.token;

      const jokesResponse = await request(server)
        .get('/api/jokes')
        .set('Authorization', token);

      expect(jokesResponse.status).toBe(200);
      expect(jokesResponse.body).toBeDefined();

    });

    it('should return 401 when not authenticated', async () => {
      const jokesResponse = await request(server).get('/api/jokes');

      expect(jokesResponse.status).toBe(401);
      expect(jokesResponse.body).toEqual({ message: "token required" });
    });
  });

});
