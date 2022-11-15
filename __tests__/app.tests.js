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

describe('/api*', () => {
  test('GET - 404, non-existent path(typo)', () => {
    return request(app)
      .get('/api/categoriesss')
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('Path not found');
      });
  });
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

describe('/api/reviews', () => {
  test('GET: 200 - responds with an object containing an array of review objects, sorted in descending date order', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(res => {
        expect(res.body.reviews.length).toBe(13);
        res.body.reviews.forEach(review => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test('GET: 200 - sorts object by descending date order', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(res => {
        expect(res.body.reviews).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe.only('/api/reviews/:review_id', () => {
  it('GET: 200 - returns a single review with the requested review_id', () => {
    return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then(res => {
        expect(res.body.review[0]).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
});
