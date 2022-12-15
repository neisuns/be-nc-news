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

exports.postComment = (id, body, username) => {
    const existingUsers = ["butter_bridge", "icellusedkars", "rogersop", "lurker"];
    if (!username || !body) {
        return Promise.reject({status: 400, msg: "Bad request"});
    }
    if (!existingUsers.includes(username)) {
        return Promise.reject({status: 404, msg: "Does not exist"});
    }
    return db.query(
        `INSERT INTO comments (article_id, body, author)
        VALUES ($1, $2, $3)
        RETURNING *;`, [id, username, body]
    )
    .then((response) => {
        return response.rows[0];
    })
}