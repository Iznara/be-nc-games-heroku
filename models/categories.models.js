const db = require('../db/connection.js');

exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`)
    return rows;
};

exports.insertCategory = async (slug, description) => {
    const queryString = `INSERT INTO categories
    (slug, description)
    VALUES ($1, $2)
    RETURNING *;`;
    const { rows } = await db.query(queryString, [slug, description])
    return rows[0];
};
