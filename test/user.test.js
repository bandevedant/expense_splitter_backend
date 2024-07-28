// test/user.test.js
import request from 'supertest';
import app from '../server.js';

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('John Doe');
  });

  it('should get user details', async () => {
    const userRes = await request(app)
      .post('/api/users')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        mobileNumber: '0987654321',
      });

    const userId = userRes.body._id;

    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Jane Doe');
  });
});
