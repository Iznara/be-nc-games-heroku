const express = require('express');
const apiRouter = require('./routers/api.router');
//const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors/errorHandling");

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

// app.all('*', (req, res) => {
//   res.status(404).send({ msg: 'Route not found' });
// });

// app.use(handleCustomErrors);
// app.use(handlePsqlErrors);
// app.use(handleServerErrors);

module.exports = app;
