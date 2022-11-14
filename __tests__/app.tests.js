const { query } = require('express');
const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('/api/categories', () => {
  test('GET: 200 - responds with an object containing an array of category objects', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(res => {
        expect(res.body.categories.length).toBe(4);
        res.body.categories.forEach(category => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
