const { getCategories } = require('./controllers/categories.controllers.js');

const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require('./controllers/reviews.controllers.js');

const {
  getCommentsByReviewId,
  postCommentByReviewId,
  removeCommentByCommentId
} = require('./controllers/comments.controllers.js');

const { getUsers } = require('./controllers/users.controllers.js');

const { getEndpoints } = require('./controllers/endpoints.controllers.js');

const express = require('express');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId);

app.patch('/api/reviews/:review_id', patchReviewById);

app.get('/api/users', getUsers);

app.get('/api', getEndpoints);

app.delete('/api/comments/:comment_id', removeCommentByCommentId)

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'User does not exist' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

app.use((err, req, res) => {
  res.status(500).send(err);
});

module.exports = app;
