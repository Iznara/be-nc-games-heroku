const { getCategories } = require('../controllers/controller');

const categoriesRouter = require('express').Router();

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter; 
