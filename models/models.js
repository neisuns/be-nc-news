const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then((response) => {
        return response.rows
    })
};
exports.selectArticles = () => {
    return db.query(
    `SELECT articles.*,
    COUNT(comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    ).then((response) => {
        if (!response) {
            return Promise.reject({
                status: 404,
                msg: "Error 404: Does not exist",
            });
        }
        return response;
    })
}

