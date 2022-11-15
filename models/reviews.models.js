const db = require('../db/connection.js');

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
  