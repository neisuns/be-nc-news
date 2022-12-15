const db = require("../db/connection");

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
        return response.rows;
    }
    )};

exports.selectArticleID = (id) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1;`, [id]
        )
        .then(({rows}) => {
            if(rows.length === 0) {
            return Promise.reject();
        }
        return rows[0];
    })
}

