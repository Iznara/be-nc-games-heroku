const { selectReviewById, updateReview, selectReviews } = require("../models/models");

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
