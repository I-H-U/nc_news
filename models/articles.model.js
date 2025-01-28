const db = require(`${__dirname}/../db/connection`);

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
      article_id,
    ])
    .then(({ rows }) => {
      return rows[0] || null;
    });
};
