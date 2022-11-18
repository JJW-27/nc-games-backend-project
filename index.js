const { getCategories } = require('./controllers/categories.controllers.js');

const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require('./controllers/reviews.controllers.js');

const {
  getCommentsByReviewId,
  postCommentByReviewId,
  removeCommentByCommentId,
} = require('./controllers/comments.controllers.js');

const {
  getUsers,
  getUserByUsername,
} = require('./controllers/users.controllers.js');

const { getEndpoints } = require('./controllers/endpoints.controllers.js');

module.exports = {
  getCategories,
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  removeCommentByCommentId,
  getUsers,
  getUserByUsername,
  getEndpoints,
};
