const db = require(`${__dirname}/../db/connection`);

exports.checkIfArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
    });
};

exports.selectArticleById = (article_id) => {
  return exports
    .checkIfArticleExists(article_id)
    .then(() => {
      return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
        article_id,
      ]);
    })
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

exports.selectCommentsByArticleId = (article_id) => {
  return exports.checkIfArticleExists(article_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`,
        [article_id]
      )
      .then(({ rows }) => rows);
  });
};
