const endpointsJson = require(`${__dirname}/../endpoints.json`);
const request = require("supertest");
const app = require(`${__dirname}/../app`);
const db = require(`${__dirname}/../db/connection`);
const seed = require(`${__dirname}/../db/seeds/seed`);
const data = require(`${__dirname}/../db/data/test-data/index`);
expect.extend(require("jest-sorted"));

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of requested article, with author, title, article_id, body, topic, created_at, votes, article_img_url properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("comment_count");
      });
  });
  test("400: invalid format", () => {
    return request(app)
      .get("/api/articles/three")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: valid format but no such article exists", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/", () => {
  test("200: Responds with an array of articles, with author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties. No body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: Articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("sorting queries", () => {
    test("200: sorts by default (created_at) column, when no column given, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: sorts by given column 'title', descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("200: sorts by given column 'comment_count', descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test("200: sorts by given column and order=asc", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", {
            ascending: true,
          });
        });
    });
    test("200: sorts by given column and order=desc", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("200: sorts by given column and orders descending by default if order has no value", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("200: defaults to created_ at column when only given order query", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("400: return error if given invalid sorty_by", () => {
      return request(app)
        .get("/api/articles?sort_by=monkeys")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("400: return error if given invalid order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=highest")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
  });
  describe("topic query", () => {
    test("200: returns articles matching given topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.topic).toEqual("mitch");
          });
        });
    });
    test("200: returns empty array when no articles for given topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        });
    });
    test("400: returns error if given invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=horses")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article, each with the properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("200: Comments are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Returns empty array if the article has no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toEqual([]);
      });
  });
  test("400: invalid format", () => {
    return request(app)
      .get("/api/articles/three/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: valid format but no such article exists", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with a comment object with properties: comment_id, votes, created_at, author, body, article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Pure tuna is the way to go!",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Pure tuna is the way to go!",
          article_id: 6,
        });
      });
  });

  test("400: request body missing data", () => {
    const newComment1 = {
      body: "Pure tuna is the way to go!",
    };
    const newComment2 = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment1)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      })
      .then(() => {
        return request(app)
          .post("/api/articles/6/comments")
          .send(newComment2)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });
  });

  test("400: responds with error message if user does not exist", () => {
    const newComment = {
      username: "iDontExist",
      body: "Pure tuna is the way to go!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("400: invalid parameter format", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Pure tuna is the way to go!",
    };
    return request(app)
      .post("/api/articles/six/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: valid format but no such article exists", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Pure tuna is the way to go!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: votes updates according to given number of votes ", () => {
    const votesAdd = { inc_votes: 5 };
    const votesMinus = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(votesAdd)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(105);
      })
      .then(() => {
        return request(app)
          .patch("/api/articles/1")
          .send(votesMinus)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(104);
          });
      });
  });
  test("400: invalid parameter format", () => {
    const votes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/one")
      .send(votes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: valid format but no such article exists", () => {
    const votes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/999")
      .send(votes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
  test("400: invalid data type", () => {
    const votes = { inc_votes: "five" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: returns error when given empty request", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/6")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: invalid parameter format", () => {
    return request(app)
      .delete("/api/comments/six")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: valid format but no such comment exists", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(4);
        body.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
