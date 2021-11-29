const db = require('../connection.js');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS categories;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);

  // 1. create tables

  //categories
  await db.query(`
  CREATE TABLE categories (
  slug VARCHAR PRIMARY KEY,
  description VARCHAR(MAX));`);

  //users
  await db.query(`
  CREATE TABLE users (
  username VARCHAR PRIMARY KEY UNIQUE,
  avatar_url VARCHAR(MAX),
  name VARCHAR NOT NULL);`);

  //reviews
  await db.query(`
  CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  review_body VARCHAR(MAX),
  designer VARCHAR,
  review_img_url VARCHAR(MAX)
  DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
  votes INT DEFAULT 0,
  category VARCHAR REFERENCES categories(slug) ON DELETE SET NULL,
  owner VARCHAR REFERENCES users(username) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

  //comments
  await db.query(`
  CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  author VARCHAR REFERENCES users(username) ON DELETE SET NULL,
  review_id VARCHAR REFERENCES reviews(review_id) ON DELETE CASCADE,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

  // 2. insert data
};

module.exports = seed;
