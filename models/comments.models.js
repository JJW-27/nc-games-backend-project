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

exports.insertCommentByReviewId = (review_id, username, body) => {

  if(body === '') {
    return Promise.reject({status: 400, msg: 'Empty comment body'})
  }
  
  return db.query(`INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [review_id, username, body]).then(comment => {
    return comment.rows[0]
  })
};

