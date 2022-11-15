const {
  selectReviews,
  selectReviewById,
} = require('../models/reviews.models.js');

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then(reviews => {
      res.status(200).send({ reviews });
    })
    .catch(err => next(err));
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  selectReviewById(review_id)
    .then(review => {
      console.log(res);
      res.status(200).send({ review });
    })
    .catch(err => next(err));
};
