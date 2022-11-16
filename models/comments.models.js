const db = require('../db/connection.js');
const { checkReviewIdExists } = require('../myUtils/myUtils.js');

exports.selectCommentsByReviewId = review_id => {
  return checkReviewIdExists(review_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
        [review_id]
      )
      .then(comments => {
        return comments.rows;
      });
  });
};
