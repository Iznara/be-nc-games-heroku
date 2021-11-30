const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router.js');

apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
