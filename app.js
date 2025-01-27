const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

module.exports = app;
