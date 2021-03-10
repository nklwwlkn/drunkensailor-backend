const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!');
  console.log(err.name, err.message);
  process.exit(1);
});


const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('db connection is OK');
  }).catch(err => {
    console.log(err);
  });

const app = require('./app');

const PORT = 8888;

app.listen(PORT, () => {
    console.log(`Server is listening port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION');

  server.close(() => {
    process.exit(1);
  });
});