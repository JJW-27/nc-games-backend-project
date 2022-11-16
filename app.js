const { getCategories } = require('./controllers/categories.controllers.js');

const {
  getReviews,
  getReviewById,
} = require('./controllers/reviews.controllers.js');

const {
  getCommentsByReviewId,
} = require('./controllers/comments.controllers.js');

const express = require('express');

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

// app.post('/api/reviews/:review_id/comments', postCommentByReviewId)

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
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
