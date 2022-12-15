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
        expect(body).toEqual({ msg: "Error 404: Does not exist" });
      });
  });
});
describe("/api/articles", () => {
  describe("GET", () => {
    test("200: Should respond wih an article object and its properties", () => {
      return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({body : {articles}}) => {
        articles.forEach((article) => {
            expect(article).toEqual(
            expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
            })
            );
          })
        });
      });
      test("200: Responds with an array of articles objects in descending order by date", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body: {articles}}) => {
          expect(articles).toBeSortedBy("created_at", {descending: true})
        });
      });
});
});  
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: Responds with an article object with its properties", () => {
      return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body : {articles} }) => {
        expect.objectContaining({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
        });
      });
    }); 
  
    test("400: Responds with bad request if article_id is invalid", () => {
      return request(app)
        .get("/api/articles/743hsvb")
        .expect(400)
        .then(({ body : { msg }}) => {
          expect(msg).toBe("Error 400: Bad request");
    });
  });
    test("404: Responds with does not exist if article_id is non-exisitent", () =>{
      return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({body : {msg}}) => {
        expect(msg).toBe("Error 404: Does not exist");
      })
    })
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("201: Should take a username and body property and responds with the posted comment", () => {
      return request(app)
      .post("/api/articles/2/comments")
      .send({usernanme: "butter_bridge", body:"cats"})
      .expect(201)
      .then(({body}) => {
        expect(body.comment).toEqual({
          body: "cats",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          comment_id: expect.any(Number),
          created_at: expect.any(String)
        })
      })
    })
  })
})