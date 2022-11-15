const { selectCommentsByReviewId } = require('../models/comments.models.js');

exports.getCommentsByReviewId = (req, res, next) => {
  console.log(req.params);
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id).then(comments => {
    res.status(200).send({ comments });
  });
};
