const { response } = require("../app");
const { selectTopics, selectArticles, selectArticleID, postComment } = require("../models/models");

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
}
exports.postComment = (request, response, next) => {
    const articleID = request.params.articleID;
    const {username, body} = request.body;
    selectArticleID(articleID).then((response) => {
        return postComment(articleID, username, body)
    })
    .then((comment) => {
        response.status(201).send({comment});
    })
    .catch((error) => {
        next(error)
    })
}