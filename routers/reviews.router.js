const { getReviewById } = require('../controllers/controller');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id').get(getReviewById);

module.exports = reviewsRouter;
