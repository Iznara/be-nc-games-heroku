const { selectCategories, selectReviewById, updateReview, selectReviews, selectCommentsByReviewId, insertComment } = require("../models/models.js");

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.status(200).send({ categories: categories });
    }).catch(next)
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.status(200).send({ review: review });
    }).catch(next)
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    updateReview(review_id, inc_votes).then(review => {
        res.status(200).send({ review: review });
    }).catch(next)
};

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    const queries = ['sort_by', 'order', 'category'];
    const keys = Object.keys(req.query);
    return keys.every(key => queries.includes(key)) ?
        selectReviews(sort_by, order, category).then(reviews => {
            res.status(200).send({ reviews: reviews });
        }).catch(next)
        : Promise.reject({ status: '400', msg: 'Invalid Query' }).catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentsByReviewId(review_id).then(comments => {
        res.status(200).send({ comments: comments });
    }).catch(next)
};

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;
    insertComment(review_id, username, body).then(comment => {
        res.status(201).send({ comment: comment })
    }).catch(next)
};