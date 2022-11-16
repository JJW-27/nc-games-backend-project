const db = require('../db/connection.js');
const { checkReviewIdExists } = require('../myUtils/myUtils.js');

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, title, category, designer, owner, review_body, review_img_url, reviews.votes, reviews.created_at, COUNT(comments.review_id) ::INT AS comment_count
    FROM reviews
    JOIN users ON reviews.owner = users.username 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id, users.username
    ORDER BY reviews.created_at DESC;`
    )
    .then(reviews => {
      return reviews.rows;
    });
};

exports.selectReviewById = review_id => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(review => {
      if (review.rows.length === 1) {
        return review.rows;
      } else {
        return Promise.reject({ status: 404, msg: 'review_id not found' });
      }
    });
};
