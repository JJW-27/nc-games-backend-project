const { getCategories } = require('./controllers/controllers.js');

const app = express();

app.get('/api/categories', getCategories);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res) => {
  res.status(500).send(err);
});

module.exports = app;
