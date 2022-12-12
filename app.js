const express = require("express");
const { getTopics } = require("./controllers/controllers");
const app = express();

//GET
app.get("/api/topics", getTopics);


//404 INVALID PATH
app.get("*/*", (request, response) => {
    response 
    .status(404)
    .send({status: 404, msg: `Error: endpoint (${request.path}) not found`})
})
module.exports = app;