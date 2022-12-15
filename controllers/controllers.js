const { response } = require("../app");
const { selectTopics, selectArticles, selectArticleID, selectArticleComments } = require("../models/models");

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
    });
};

exports.getArticleID = (request, response, next) => {
    const articleID = request.params.article_id;
    selectArticleID(articleID).then((article) => {
        response.status(200).send({article});
    })
    .catch((error) => {
        next(error); 
    });
};

exports.getArticleComments = (request, response, next) => {
    const articleID = request.params.article_id;
    selectArticleComments(articleID).then((comments) => {
        response.status(200).send({comments});
    })
    .catch((error) => {
        next(error)
    })

}
