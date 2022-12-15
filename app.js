const express = require("express");
const { getTopics, getArticles, getArticleID, postComment } = require("./controllers/controllers");
const app = express();

//GET
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleID)

//POST
app.post("/api/articles/:article_id/comments", postComment);

//404 INVALID PATH
app.all("*", (request, response) => {
    response 
    .status(404)
    .send({msg: `Error 404: Does not exist`})
})

app.use((error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send({ msg: "Error 400: Bad request"})
    } else next(error)
})

app.use((error, request, response, next) => {
    if (error.msg) {
        response.status(404).send({msg : error.msg });
    } else next(error);
});
app.use((error, request, response, next) => {
    if (error.code === "23503") {
        response.status(404).send({msg: "Error 404: Does not exist"})
    } else next(error);
})

app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({ msg : "Error 500: Internal Server Error" })
});

module.exports = app;