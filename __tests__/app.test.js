const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: Returns an array of topics, each of which should have properties of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});
describe("404: endpoints not found", () => {
  test("should return a message and an error status code", () => {
    return request(app)
      .get("/invalidpath")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Error: Does not exist" });
      });
  });
});
describe("/api/articles", () => {
  describe("GET", () => {
    test("200: Should respond wih an article object and its properties", () => {
      return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({body : {articleRows}}) => {
        articleRows.forEach((article) => {
            expect(article).toEqual(
            expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
                body: expect.any(String),
            })
            );
          })
        });
      });
      test("200: Responds with an array of articles objects in descending order by date", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body: {articleRows}}) => {
          expect(articleRows).toBeSortedBy("created_at", {descending: true})
        });
      });
});
});  











// test("200: Responds with a new property of comment_count which has the correct number of comments by aricle_id", () => {
//         return request(app)
//         .get("/api/articles/1")
//         .expect(200)
//         .then(({body}) => {
//           expect(body.article.comment_count).toBe("11")
//         })
//       })
