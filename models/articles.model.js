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

exports.selectArticles = (sort_by, order, topic) => {
  const validColumns = [
    "article_id",
    "author",
    "title",
    "comment_count",
    "topic",
    "created_at",
    "article_img_url",
  ];
  const validOrders = ["asc", "desc"];
  const validTopics = ["cats", "mitch", "paper"];
  const queryParams = [];
  let queryStr = `SELECT articles.author , articles.title , articles.article_id , articles.topic , articles.created_at , articles.votes , articles.article_img_url , COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;

  if (!validColumns.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  if (topic) {
    if (!validTopics.includes(topic)) {
      return Promise.reject({ status: 400, message: "Bad request" });
    }
    queryStr += `WHERE topic = $1 `;
    queryParams.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryParams).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not found" });
    }
    return rows;
  });
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

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + ($1) WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }

      return rows[0];
    });
};
