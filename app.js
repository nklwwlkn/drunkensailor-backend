const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    res.json(
        {
            status: "success",
            message: "Entry point"
        }
    );
});


module.exports = app;