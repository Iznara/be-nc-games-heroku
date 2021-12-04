const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router.js');
const commentsRouter = require('./comments.router.js');
const reviewsRouter = require('./reviews.router.js');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
