const db = require('../db/connection.js');
const { checkReviewIdExists } = require('../myUtils/myUtils.js');

exports.selectReviews = category => {
  let queryStr = `SELECT reviews.review_id, title, category, designer, owner, review_body, review_img_url, reviews.votes, reviews.created_at, COUNT(comments.review_id) ::INT AS comment_count
  FROM reviews
  JOIN users ON reviews.owner = users.username 
  LEFT JOIN comments ON reviews.review_id = comments.review_id `;

  const queryValues = [];

  if (category) {
    queryStr += ` WHERE category = $1 `;
    queryValues.push(category);
  }

  queryStr += `GROUP BY reviews.review_id, users.username
    ORDER BY reviews.created_at DESC;`;

  return db.query(queryStr, queryValues).then(reviews => {
    return reviews.rows;
  });
};

exports.selectReviewById = review_id => {
  return db
    .query(
      `SELECT reviews.review_id, title, category, designer, owner, review_body, review_img_url, reviews.votes, reviews.created_at, COUNT(comments.review_id) ::INT AS comment_count
    FROM reviews
    JOIN users ON reviews.owner = users.username 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id, users.username
    `,
      [review_id]
    )
    .then(review => {
      if (review.rows.length === 1) {
        return review.rows;
      } else {
        return Promise.reject({ status: 404, msg: 'review_id not found' });
      }
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  if (inc_votes === '') {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes must have a number value',
    });
  }

  if (inc_votes === 0) {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes must be greater than or less than 0',
    });
  }

  if (typeof inc_votes === 'number' && inc_votes % 1 !== 0) {
    return Promise.reject({
      status: 400,
      msg: 'inc_votes must be a whole number',
    });
  }
  return checkReviewIdExists(review_id).then(() => {
    return db
      .query(
        'UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',
        [inc_votes, review_id]
      )
      .then(updatedComment => {
        return updatedComment.rows[0];
      });
  });
};
