const db = require('../db/connection.js');

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(users => {
    return users.rows;
  });
};

exports.selectUserByUsername = username => {
  if(!isNaN(username)) {return Promise.reject({ status: 400, msg: 'Bad request' })}
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(user => {
      if (user.rows.length === 1) {
        return user.rows;
      } else {
        return Promise.reject({ status: 404, msg: 'username not found' });
      }
    });
};
