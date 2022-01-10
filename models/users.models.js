const db = require('../db/connection.js');

exports.selectUsers = async () => {
    const { rows } = await db.query(`SELECT users.username FROM users;`);
    return rows;
};

exports.selectUser = async (username) => {
    const { rows } = await db.query(`
    SELECT users.username, users.avatar_url, users.name
    FROM users WHERE username = $1`, [username]);
    return rows.length !== 0 ?
        rows : Promise.reject({ status: '404', msg: 'User Not Found' })
};
