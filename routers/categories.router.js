const categoriesRouter = require('express').Router();

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter; 
