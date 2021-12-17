const { getCommentsByReviewId, postComment } = require('../controllers/comments.controller');
const { getReviewById, patchReview, getReviews } = require('../controllers/reviews.controller');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/')
.get(getReviews);

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(patchReview);

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReviewId)
.post(postComment);

module.exports = reviewsRouter;
