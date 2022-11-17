const {
  selectReviews,
  selectReviewById,
  updateReviewById,
} = require('../models/reviews.models.js');

exports.getReviews = (req, res, next) => {
  const {category} = req.query;
  selectReviews(category)
    .then(reviews => {
      res.status(200).send({ reviews });
    })
    .catch(err => next(err));
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  selectReviewById(review_id)
    .then(review => {
      res.status(200).send({ review });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateReviewById(review_id, inc_votes)
    .then(review => {
      res.status(200).send({ review });
    })
    .catch(err => {
      next(err);
    });
};
