const db = require('../db/connection.js');
const fs = require("fs/promises");


exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`)
    return rows;
};

exports.selectReviewById = async (id) => {
    const queryStr = `
    SELECT reviews.*,
    COUNT(comment_id)::INT AS comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id;`
    const { rows } = await db.query(queryStr, [id])
    return rows[0];
};

exports.updateReview = async (id, vote) => {
    const queryStr = `
    UPDATE reviews SET votes = votes + $2 
    WHERE review_id = $1 RETURNING *`
    const review = await db.query(queryStr, [id, vote]);
    return vote === undefined ?
        Promise.reject({ status: '400', msg: 'Bad Request' })
        : review.rows[0]
};

exports.selectReviews = async (sort = 'created_at', order = 'desc', category) => {
    let queryStr = `
    SELECT reviews.*,
    COUNT(comment_id)::INT AS comment_count, 
    COUNT(*) OVER()::INT AS total_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id `
    const queryArr = [];
    if (category) {
        queryArr.push(category)
        queryStr += `WHERE category = $1 `;
    }
    queryStr += `GROUP BY reviews.review_id `
    queryStr += `ORDER BY ${sort} ${order} `

    const { rows } = await db.query(queryStr, queryArr)

    if (rows.length === 0 && category !== undefined) {
        const queryResult = await db.query(`SELECT * FROM categories WHERE slug = $1`, [category])
        return queryResult.rows.length === 0
            ? Promise.reject({ status: '404', msg: 'Category does not exist in the database' })
            : Promise.reject({ status: '404', msg: 'No reviews found for this category' })
    } else {
        return rows;
    }
}

exports.selectCommentsByReviewId = async (id) => {
    const queryStr = `
    SELECT * FROM comments WHERE review_id = $1;`
    const { rows } = await db.query(queryStr, [id])
    return rows.length !== 0 ?
        rows : Promise.reject({ status: '404', msg: 'No comments found for this review' })
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
    return rows;
};
