const db = require('../db/connection.js');

exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`)
    return rows;
};

exports.selectReviewById = async (id) => {
    //--using CAST :: operator to convert a value of one datatype into another
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
    return vote !== undefined ?
        review.rows[0] : Promise.reject({ status: '400', msg: 'Bad Request' })
};

// exports.selectReviews = async