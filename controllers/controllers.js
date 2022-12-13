const { response } = require("../app");
const { selectTopics, selectArticlesByID } = require("../models/models");

exports.getTopics = (request, response) => {
    selectTopics().then((topic) => {
        response.status(200).send({topics : topic });
    })
};

