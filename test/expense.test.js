// test/expense.test.js
import request from 'supertest';
import app from '../server.js';

describe('Expense API', () => {
  it('should add a new expense', async () => {
    const userRes = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '1234567890',
      });

    const userId = userRes.body._id;

    const res = await request(app)
      .post('/api/expenses')
      .send({
        description: 'Dinner',
        amount: 3000,
        paidBy: userId,
        participants: [
          { user: userId, amountOwed: 1000 },
          { user: userId, amountOwed: 1000 },
          { user: userId, amountOwed: 1000 },
        ],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.description).toBe('Dinner');
  });

  it('should get expenses for a user', async () => {
    const userRes = await request(app)
      .post('/api/users')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        mobileNumber: '0987654321',
      });

    const userId = userRes.body._id;

    const expenseRes = await request(app)
      .post('/api/expenses')
      .send({
        description: 'Shopping',
        amount: 4299,
        paidBy: userId,
        participants: [
          { user: userId, amountOwed: 1500 },
          { user: userId, amountOwed: 799 },
          { user: userId, amountOwed: 2000 },
        ],
      });

    const res = await request(app).get(`/api/expenses/user/${userId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBe('Shopping');
  });
});
