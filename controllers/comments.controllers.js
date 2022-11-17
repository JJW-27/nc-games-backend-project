const {
  selectCommentsByReviewId,
  insertCommentByReviewId,
  deleteCommentByCommentId,
} = require('../models/comments.models.js');

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  insertCommentByReviewId(review_id, username, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err)
      next(err);
    });
};

exports.removeCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentId(comment_id)
    .then(() => res.status(204).send())
    .catch(err => next(err));
};
