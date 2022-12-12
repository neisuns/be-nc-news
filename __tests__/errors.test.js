const request = require("supertest");
const app = require("../app");

describe("global errors", () => {
    describe("404: endpoints not found", () => 
    test("should return a 404 status code if the end point is not found", () => {
      return request(app).get("/invalidpath").expect(404) 
    }));

    test("should return a message and an error status code", () => {
        return request(app)
        .get("/invalidpath")
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({
                status: 404,
                msg: "Error: endpoint (/invalidpath) not found",
            })
        })
    })
})