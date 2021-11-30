exports.handle404Errors = (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code) {
        res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};