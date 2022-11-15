const db = require('../db/connection.js');

exports.selectCommentsByReviewId = review_id => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then(comments => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'review_id not found' });
      } else {
        return comments.rows;
      }
    });
};
