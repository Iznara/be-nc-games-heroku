const { getCommentsByReviewId, postComment } = require('../controllers/comments.controller');
const { getReviewById, patchReview, getReviews, postReview, deleteReview } = require('../controllers/reviews.controller');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/')
.get(getReviews)
.post(postReview);

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(patchReview)
.delete(deleteReview);

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReviewId)
.post(postComment);

module.exports = reviewsRouter;
