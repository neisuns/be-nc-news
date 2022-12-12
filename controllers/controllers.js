const { response } = require("../app");
const { selectTopics } = require("../models/models");

exports.getTopics = (request, response) => {
    selectTopics().then((topic) => {
        // console.log(topics)
        response.status(200).send({topics : topic });
    });
};