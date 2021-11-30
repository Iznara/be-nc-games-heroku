const { selectCategories } = require("../models/models.js");

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        
        res.status(200).send({ categories: categories });
        console.log(categories);
    })
    .catch(next)
};