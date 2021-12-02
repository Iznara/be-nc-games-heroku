const { selectCategories, selectReviewById, updateReview, selectReviews } = require("../models/models.js");

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

// exports.getReviews = (req, res, next) => {
//     selectReviews().then(reviews => {
//         res.status(200).send({ reviews: reviews });
//     })
//     .catch(next)
// };

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    const queries = ['sort_by', 'order', 'category'];
    const keys = Object.keys(req.query);

    if (keys.every(key => queries.includes(key))) {
        selectReviews(sort_by, order, category).then(reviews => {
            res.status(200).send({ reviews: reviews });
        }).catch(next);
    };
};