const { selectCategories, selectReviewById } = require("../models/models.js");

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {      
        res.status(200).send({ categories: categories });
    })
    .catch(next)
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.status(200).send({ review: review });
    })
    .catch(next)
};