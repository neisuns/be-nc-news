const express = require("express");
const { getTopics, getArticlesByID } = require("./controllers/controllers");
const app = express();

//GET
app.get("/api/topics", getTopics);


//404 INVALID PATH
app.get("*/*", (request, response) => {
    response 
    .status(404)
    .send({msg: `Error: endpoint not found`})
})
module.exports = app;