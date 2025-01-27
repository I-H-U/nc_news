const express = require("express");
const { getApi } = require("./controllers/api.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

module.exports = app;
