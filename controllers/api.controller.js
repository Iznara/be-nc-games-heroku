const { readSummary } = require("../models/models.js");

exports.getSummary = (req, res, next) => {
    readSummary().then(summary => {
        res.status(200).send({ summary : summary })
    }).catch(next)
};
