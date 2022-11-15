const { getCategories} = require('./controllers/categories.controllers.js');

const { getReviews } = require('./controllers/reviews.controllers.js');

const express = require('express');

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res) => {
  res.status(500).send(err);
});

module.exports = app;
