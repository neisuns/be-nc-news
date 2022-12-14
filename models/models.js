const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};
exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.*,
    COUNT(comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then((response) => {
      return response.rows;
    });
};

exports.selectArticleID = (id) => {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject();
      }
      return rows[0];
    });
};

exports.selectArticleComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY comments.created_at DESC;`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return db
          .query(
            `SELECT * FROM articles
                    WHERE article_id = $1;`,
            [id]
          )
          .then((result) => {
            if (result.rows.length > 0) {
              return response.rows;
            }
            return Promise.reject({
              status: 404,
              msg: "Error 404: Does not exist",
            });
          });
      }
      return response.rows;
    });
};
exports.insertComments = (id, body, author) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) 
                values ($1, $2, $3)
                RETURNING *;`,
      [id, body, author]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
exports.patchVotes = (id, inc_vote) => {
    if (inc_vote === undefined) {
        return db.query(
            `SELECT * FROM articles
            WHERE article_id = $1;`, [id]
        )
        .then(({rows}) => {
            return rows[0];
        });
    }
    return db.query(
        `UPDATE articles
        SET votes = votes +$1
        WHERE article_id = $2
        RETURNING *;`, [inc_vote, id]
    )
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "Error 404: Does not exist"
            });
        }
        return rows[0];
    })
}
