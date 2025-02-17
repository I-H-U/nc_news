const express = require("express");
const cors = require("cors");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  patchArticleVotes,
} = require("./controllers/articles.controller");
const {
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log("in app.use error 500", err);
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

module.exports = app;
