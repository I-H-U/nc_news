const { checkIfArticleExists } = require("../models/articles.model");
const { addComment } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const promises = [
    checkIfArticleExists(article_id),
    addComment(article_id, username, body),
  ];
  Promise.all(promises)
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
