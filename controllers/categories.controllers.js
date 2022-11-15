const { selectCategories } = require('../models/categories.models.js');

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then(categories => {
      res.status(200).send({ categories });
    })
    .catch(err => {
      next(err);
    });
};
