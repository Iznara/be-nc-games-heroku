const endpoints = require("../endpoints.json")

exports.getSummary = (req, res, next) => {
        res.status(200).send({ summary : endpoints })};
