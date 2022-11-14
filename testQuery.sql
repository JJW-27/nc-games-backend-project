\c nc_games_test

SELECT reviews.review_id, title, category, designer, owner, review_body, review_img_url, reviews.votes, reviews.created_at, COUNT(comments.review_id) AS comment_count
  FROM reviews
  JOIN users ON reviews.owner = users.username 
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;