const express = require('express');

const { getCategories } = require('./controllers/controllers.js');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  res.status(400).send({msg: err.msg})
  } 
);

app.use((err, req, res)=> {
  console.log(err)
})

module.exports = app;