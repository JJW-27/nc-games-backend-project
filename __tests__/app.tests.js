const { query } = require('express');
const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const endpoints = require('../endpoints.json');

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
  test('GET: 200 - responds with an object containing an array of review objects', () => {
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

  test('GET: 200 - sorts reviews in descending date order by default', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(res => {
        expect(res.body.reviews).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });

  test('GET:200 - selects the reviews by queried category', () => {
    return request(app)
      .get('/api/reviews?category=dexterity')
      .expect(200)
      .then(res => {
        expect(res.body.reviews.length).toBe(1);
        res.body.reviews.forEach(review => {
          expect(review.category).toBe('dexterity');
        });
      });
  });

  test('GET: 200 - sorts reviews by query', () => {
    return request(app)
      .get('/api/reviews?sort_by=votes')
      .expect(200)
      .then(res => {
        expect(res.body.reviews).toBeSortedBy('votes', {
          descending: true,
        });
      });
  });

  test('GET: 200 - sorts in ascending order when included in the query', () => {
    return request(app)
      .get('/api/reviews?sort_by=votes&order=ASC')
      .expect(200)
      .then(res => {
        expect(res.body.reviews).toBeSortedBy('votes');
      });
  });

  test('GET: 400 - sort_by query is resistant to query SQL injection', () => {
    return request(app)
      .get('/api/reviews?sort_by=jibberish')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('invalid sort query');
      });
  });

  test('GET: 400 - order query is resistant to query SQL injection', () => {
    return request(app)
      .get('/api/reviews?order=jibberish')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('invalid sort query');
      });
  });
});

describe('/api/reviews/:review_id', () => {
  it('GET: 200 - responds with a single review with the requested review_id, including a count of all comments for that review', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(res => {
        expect(res.body.review[0]).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
          comment_count: 3,
        });
      });
  });

  it('GET: 200 - works when there are no comments for the requested review_id', () => {
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
          comment_count: 0,
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

  it('PATCH: 200 - updates review with given review_id and responds with the updated review', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 2 })
      .expect(200)
      .then(res => {
        expect(res.body.review).toMatchObject({
          title: 'Agricola',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Farmyard fun!',
          category: 'euro game',
          created_at: expect.any(String),
          votes: 3,
        });
      });
  });
  it('PATCH:400 - incorrect patch body key (NOT NULL VIOLATION)', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc: 2 })
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });

  it('PATCH:400 - incorrect patch data type', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 'two' })
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });

  it('PATCH:400 - inc_votes empty', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: '' })
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('inc_votes must have a number value');
      });
  });

  it('PATCH:400 - inc_votes = 0', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 0 })
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe(
          'inc_votes must be greater than or less than 0'
        );
      });
  });

  it('PATCH:400 - inc_votes is not a whole number', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 2.1 })
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('inc_votes must be a whole number');
      });
  });

  it('PATCH: 404 - valid but non-existent review_id', () => {
    return request(app)
      .patch('/api/reviews/30')
      .send({ inc_votes: 2 })
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('review_id not found');
      });
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

describe('/api/users', () => {
  test('GET: 200 - responds with an object containing an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(res => {
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach(user => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('/api/users/:username', () => {
  it('GET: 200 - responds with a single user with the requested username', () => {
    return request(app)
      .get('/api/users/mallionaire')
      .expect(200)
      .then(res => {
        expect(res.body.user[0]).toEqual({
          username: 'mallionaire',
          name: 'haz',
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        });
      });
  });

  it('GET: 400 - Bad request', () => {
    return request(app)
      .get('/api/users/1')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('Bad request');
      });
  });

  it('GET: 404 - Valid but non-existent username', () => {
    return request(app)
      .get('/api/users/bananas')
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('username not found');
      });
  });
});

describe('/api/comments/:comment_id', () => {
  test('DELETE: 204 - deletes comment with given comment_id', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });

  test('DELETE: 404 - comment with comment_id not found', () => {
    return request(app)
      .delete('/api/comments/30')
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe('comment_id not found');
      });
  });
});

describe('/api', () => {
  test('GET: 200 - responds with a JSON describing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(res => {
        expect(res.body.endpoints).toEqual(endpoints);
      });
  });
});

describe('/', () => {
  test('homepage sends welcome message with endpoint information', () => {
    return request(app)
      .get('/')
      .then(res => {
        expect(res.text).toBe(
          'Welcome! For a list of available endpoints, please access endpoint /api'
        );
      });
  });
});
