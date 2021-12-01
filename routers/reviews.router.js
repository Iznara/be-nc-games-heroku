const { getReviewById, patchReview } = require('../controllers/controller');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(patchReview);

module.exports = reviewsRouter;
