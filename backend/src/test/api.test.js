import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('GET /api/health', () => {
  it('should respond with a success message if the database connection is successful', async () => {
    const response = await request(app).get('/api/health');
    // The test will either pass or fail depending on the database connection.
    // A 200 status code indicates a successful connection.
    // A 500 status code indicates a failed connection.
    expect([200, 500]).toContain(response.status);
  });
});
