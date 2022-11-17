const db = require('../db/connection.js');

exports.checkReviewIdExists = review_id => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(res => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'review_id not found' });
      }
    });
};

exports.checkCommentIdExists = comment_id => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(res => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'comment_id not found' });
      }
    });
};
