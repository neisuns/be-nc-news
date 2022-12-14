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
  describe("GET", () => {
    test("200: Responds with a array of all comments when passed in the article_id", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(0);
        body.comments.forEach((comment) => {
          expect.objectContaining({
            article_id: 1,
            comment_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
          })
        })
      })
    })
    test("200: Responds with an empty array when there are no comments in a given articke_id", () => {
      return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toEqual([])
      })
    })
    test("200: Repsonds with an array of comments in descending order", () => {
      return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((comments) => {
        expect(comments.body.comments).toBeSortedBy("created_at", {descending: true})
      })
    })
    test("400: Responds with bad request if article_id is not of a correct data type", () => {
      return request(app)
      .get("/api/articles/cats/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Error 400: Bad request");
      })
    })
    test("404: Responds with 404 if there is no such article_id", () => {
      return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Error 404: Does not exist")
      })
    })
  })
})

describe("/api/article_id/comments", () => {
  describe("POST", () => {
    test("201: Should take a username and body property and respond with the posted comment", () => {
      const newComment = {
        author: "butter_bridge",
        body: "Kachow"
      }
      return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({body: {comment}}) => {
        expect(comment).toEqual(
          expect.objectContaining({
          body: "Kachow",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        }))
      })
    })
    test("400: Should respond with bad request if no username is inputted", () => {
      return request(app)
      .post("/api/articles/2/comments")
      .send({body: "Kachow"})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Error 400: Bad request")
      })
    })
    test("400: Should respond with a bad request if article_id is invalid", () => {
      return request(app)
      .post("/api/articles/ghibli/comments")
      .send({ author: "butter_bridge", body:"Kachow"})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Error 400: Bad request")
      })
    })
    test("404: Should respond with a invalid request if article_id does not exist", () => {
      return request(app)
      .post("/api/articles/100/comments")
      .send({ author: "butter_bridge", body:"Kachow"})
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Error 404: Does not exist")
      })
    })
    test("404: Should respond with a invalid request if author does not exist", () => {
      return request(app)
      .post("/api/articles/2/comments")
      .send({ author: "Lightning McQueen", body:"Kachow"})
       .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Error 404: Does not exist")
      })
    })
  })
})

describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("200: Responds with incrementing article votes by the given number and return an updated version of that article", () => {
      const newVote = { inc_votes: 1};
      return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body : {article}}) => {
        expect(article.votes).toBe(101)
      })
    })
    test("200: Should decrement selected article votes by the given number nd return the updated review", () => {
      const newVote = { inc_votes: -1};
      return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body : {article}}) => {
        expect(article.votes).toBe(99)
      })
    })
    test("200: Should respond with no changes in the article when given no new votes are received", () => {
      const newVote = { inc_votes: 0};
      return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body : {article}}) => {
        expect(article.votes).toBe(100)
      })
    })
    test("400: Should respond with a bad request if the inc_votes is of an invalid type", () => {
      const newVote = { inc_votes: "kachow"};
      return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).toBe("Error 400: Bad request")
      })
    })
    test("400: Should respond with a bad request if the article_id is of an invalid type", () => {
      const newVote = { inc_votes: 1};
      return request(app)
      .patch("/api/articles/kachow")
      .send(newVote)
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).toBe("Error 400: Bad request")
      })
    })
    test("404: Should respond with a 404 if an article_id is non-exisitent", () => {
      const newVote = { inc_votes: 1};
      return request(app)
      .patch("/api/articles/100")
      .send(newVote)
      .expect(404)
      .then(({ body : {msg}}) => {
        expect(msg).toBe("Error 404: Does not exist")
      })
    })
  })
})