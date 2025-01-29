const db = require(`${__dirname}/../db/connection`);

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => rows);
};
