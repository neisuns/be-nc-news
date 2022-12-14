const express = require("express");
const { getTopics, getArticles } = require("./controllers/controllers");
const app = express();

//GET
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

//404 INVALID PATH
app.get("*/*", (request, response) => {
    response 
    .status(404)
    .send({msg: `Error: Does not exist`})
})

app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({ msg : "Error 500" })
})

module.exports = app;