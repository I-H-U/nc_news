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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author , articles.title , articles.article_id , articles.topic , articles.created_at , articles.votes , articles.article_img_url , COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => rows);
};
