const { response } = require("../app");
const { selectTopics, selectArticles, selectArticleID, selectArticleComments, insertComments, patchVotes } = require("../models/models");

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
exports.postComments = (request, response, next) => {
    const author = request.body.author;
    const body = request.body.body;
    const articleID = request.params.article_id
    insertComments(articleID, body, author).then((comment) => {
       response.status(201).send({comment});
    })
    .catch((error) => {
        next(error);
    })
}
exports.patchArticleVotes = (request, response, next) => {
    const {inc_votes} = request.body;
    const articleID = request.params.article_id;
    patchVotes(articleID, inc_votes).then((article) => {
        response.status(200).send({article});
    })
    .catch((error) => {
        next(error);
    })
}