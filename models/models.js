const db = require('../db/connection.js');

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