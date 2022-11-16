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
      res.status(200).send({ review });
    })
    .catch(err => {
      next(err);
    });
};


//move to comments controllers
exports.postCommentByReviewId = (req, res, next) => {
  const {review_id} = req.params;
  const {username, body} = req.body;
insertCommentByReviewId(review_id, username, body).then(comment => {
  res.status(201).send({comment})
})
}
