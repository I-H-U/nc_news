const { checkIfArticleExists } = require("./articles.model");

const db = require(`${__dirname}/../db/connection`);

exports.addComment = (article_id, username, body) => {
  return checkIfArticleExists(article_id)
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [article_id, username, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
