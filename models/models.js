const db = require('../db/connection.js');

exports.selectCategories = () => {
  return db
    .query('SELECT * FROM categories;')
    .then(categories => {
      return categories.rows;
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
};
