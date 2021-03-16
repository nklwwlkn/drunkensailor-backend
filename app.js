const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const ngoRouter = require('./routes/ngoRoutes');
const projectRouter = require('./routes/projectRoutes');


const app = express();

app.use(helmet())
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/ngos', ngoRouter);
app.use('/api/v1/projects', projectRouter);

app.use('/', (req, res, next) => {
    res.json({
        "status": "success",
        "message": "Go away, and never come back."
    })
});


app.use(globalErrorHandler);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });

module.exports = app;
