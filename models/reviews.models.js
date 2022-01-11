const db = require('../db/connection.js');

exports.selectReviewById = async (id) => {
    const queryStr = `
    SELECT reviews.*,
    COUNT(comment_id)::INT AS comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id;`
    const { rows } = await db.query(queryStr, [id])

    return rows.length !== 0 ?
        rows[0] : Promise.reject({ status: '404', msg: 'Review Not Found' })
};

exports.updateReview = async (id, vote = 0) => {
    const queryStr = `
    UPDATE reviews SET votes = votes + $2 
    WHERE review_id = $1 RETURNING *`

    const review = await db.query(queryStr, [id, vote]);
    return review.rows[0]
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
            ? Promise.reject({ status: '404', msg: 'Category does not exist in the database' }) : [];
    } else {
        return rows;
    }
};

exports.insertReview = async (owner, title, review_body, designer, category) => {
    const queryStr = `
    INSERT INTO reviews
    (owner, title, review_body, designer, category)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const { rows } = await db.query(queryStr, [owner, title, review_body, designer, category]);
    return rows[0];
};

exports.removeReview = async (id) => {
    const queryStr = `
    DELETE FROM reviews WHERE review_id = $1 RETURNING *;`
    const { rows } = await db.query(queryStr, [id])
    return rows.length !== 0 ?
        rows : Promise.reject({ status: '404', msg: 'The review you are attempting to delete does not exist' })
};
