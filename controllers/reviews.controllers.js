const { selectReviews } = require('../models/reviews.models.js');

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then(reviews => {
      res.status(200).send({ reviews });
    })
    .catch(err => next(err));
};
