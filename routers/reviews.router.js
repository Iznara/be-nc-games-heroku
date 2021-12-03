const { getReviewById, patchReview, getReviews, getCommentsByReviewId } = require('../controllers/controller');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/')
.get(getReviews);

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(patchReview);

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReviewId);

module.exports = reviewsRouter;
