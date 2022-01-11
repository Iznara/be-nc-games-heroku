const db = require('../db/connection.js');

exports.selectCommentsByReviewId = async (id, page = 1, limit = 10) => {
    const queryStr = `
    SELECT * FROM comments WHERE review_id = $1
    LIMIT $3 OFFSET(($2 - 1) * $3);`
    const { rows } = await db.query(queryStr, [id, page, limit])
    const reviewResult = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id]);
    return reviewResult.rows.length !== 0 ?
        rows : Promise.reject({ status: '404', msg: 'The review you are attempting to view does not exist' })
};

exports.insertComment = async (id, user, body) => {
    const queryStr = `
    INSERT INTO comments 
    (body, author, review_id)
    VALUES ($1, $2, $3)
    RETURNING *;`
    const { rows } = await db.query(queryStr, [body, user, id])

    return user === undefined || body === undefined ?
        Promise.reject({ status: '400', msg: 'Bad Request' })
        : rows[0];
};

exports.removeComment = async (id) => {
    const queryStr = `
    DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
    const { rows } = await db.query(queryStr, [id])
    return rows.length !== 0 ?
        rows : Promise.reject({ status: '404', msg: 'The comment you are attempting to delete does not exist' })
};

exports.updateComment = async (id, vote = 0) => {
    const queryStr = `
    UPDATE comments SET votes = votes + $2 
    WHERE comment_id = $1 RETURNING *`
    const comment = await db.query(queryStr, [id, vote]);
    return comment.rows[0]
};
