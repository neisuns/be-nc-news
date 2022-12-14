const { response } = require("../app");
const { selectTopics, selectArticles } = require("../models/models");

exports.getTopics = (request, response) => {
    selectTopics().then((topic) => {
        response.status(200).send({topics : topic });
    });
};

exports.getArticles = (request, response, next) => {
    selectArticles().then((articles) => {
        response.status(200).send({articles: articles});
    })
    .catch((error) => {
        next(error); 
    })
}
