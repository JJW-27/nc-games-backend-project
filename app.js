const {
  getCategories,
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  removeCommentByCommentId,
  getUsers,
  getUserByUsername,
  getEndpoints,
} = require('./index.js');

const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send(
    'Welcome! For a list of available endpoints, please access endpoint /api'
  );
});

app.get('/api', getEndpoints);

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.route('/api/reviews/:review_id').get(getReviewById).patch(patchReviewById);

app
  .route('/api/reviews/:review_id/comments')
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

app.get('/api/users', getUsers);

app.get('/api/users/:username', getUserByUsername);

app.delete('/api/comments/:comment_id', removeCommentByCommentId);

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
