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

describe('/api/reviews/:review_id', () => {
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

  it('GET: 400 - Bad request', () => {
    return request(app)
      .get('/api/reviews/bananas')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });

  it('GET: 404 - Valid but non-existent review_id', () => {
    return request(app)
      .get('/api/reviews/30')
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('review_id not found');
      });
  });

  it.only('PATCH: 200 - updates review with given review_id and responds with the updated review', () => {
    return request(app).patch('/api/reviews/1').send({inc_votes: 2}).expect(200).then(res => {
      expect(res.body.review).toMatchObject({
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: expect.any(String),
        votes: 3
      },)
    })
  });
});

describe('/api/reviews/:review_id/comments', () => {
  it('GET: 200 - responds with an array of comments for the requested id, sorted with most recent comments first', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(res => {
        expect(res.body.comments.length).toBe(3);
        res.body.comments.forEach(comment => {
          expect(comment).toMatchObject({
            review_id: 2,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(res.body.comments).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });

  it('GET: 200 - valid review_id but no associated comments,responds with an empty array', () => {
    return request(app)
      .get('/api/reviews/1/comments')
      .expect(200)
      .then(res => {
        expect(res.body.comments).toEqual([]);
      });
  });

  it('GET: 400 - Bad request', () => {
    return request(app)
      .get('/api/reviews/bananas/comments')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });

  it('GET: 404 - Valid but non-existent review_id', () => {
    return request(app)
      .get('/api/reviews/30/comments')
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('review_id not found');
      });
  });
});

describe('/api/reviews/:review_id/comments', () => {
  const validComment = {
    username: 'philippaclaire9',
    body: 'Great game!',
  };

  it('POST: 201 - adds comment with given review_id and responds with the added comment', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send(validComment)
      .expect(201)
      .then(res => {
        expect(res.body.comment).toMatchObject({
          review_id: 1,
          author: 'philippaclaire9',
          body: 'Great game!',
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  it('POST: 400 - user does not exist', () => {
    const newComment = {
      username: 'ComicBookGuy',
      body: 'Worst. Review. EVER.',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(newComment)
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('User does not exist');
      });
  });
  it('POST: 400 - empty comment body', () => {
    const newComment = {
      username: 'philippaclaire9',
      body: '',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(newComment)
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Empty comment body');
      });
  });
  it('POST: 400 - Bad request when invalid review_id data type', () => {
    return request(app)
      .post('/api/reviews/bananas/comments')
      .send(validComment)
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });
  it('POST: 400 - Bad request when the request body keys are wrong (NOT NULL VIOLATION)', () => {
    const invalidComment = {
      name: 'philippaclaire9',
      body: 'Great game!',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(invalidComment)
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });
  it('POST: 404 - Valid but non-existent review_id', () => {
    return request(app)
      .post('/api/reviews/30/comments')
      .send(validComment)
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('review_id not found');
      });
  });
});

