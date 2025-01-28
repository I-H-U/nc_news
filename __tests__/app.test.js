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
