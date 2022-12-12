
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => {
    if(db.end) db.end();
});

beforeEach(() => {
    return seed(testData)
});

describe("/api/topics", () => {
    describe("GET", () => {
        test("200: Returns an array of topics, each of which should have properties of slug and description", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body}) => {
               const { topics } = body
               expect(topics).toHaveLength(3);
               topics.forEach((topic) => {
               expect(topic).toEqual(
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
               })
               );
            })
            });
        })
    })
})
    describe("404: endpoints not found", () => {
    test("should return a message and an error status code", () => {
        return request(app)
        .get("/invalidpath")
        .expect(404)
        .then(({body}) => {
            console.log(body)
            expect(body).toEqual({msg: "Error: endpoint not found"})
        })
    })
})