const express = require('express');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const ngoRouter = require('./routes/ngoRoutes');
const projectRouter = require('./routes/projectRoutes');

const app = express();

app.use(express.json());


app.use('/api/v1/users', userRouter);
app.use('/api/v1/ngos', ngoRouter);
app.use('/api/v1/projects', projectRouter);

app.use(globalErrorHandler);

module.exports = app;