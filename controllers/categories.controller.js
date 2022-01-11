const { selectCategories, insertCategory } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.status(200).send({ categories: categories });
    }).catch(next)
};

exports.postCategory = (req, res, next) => {
    const { slug, description } = req.body;
    insertCategory(slug, description).then(category => {
        res.status(201).send({ category: category });
    }).catch(next)
};
