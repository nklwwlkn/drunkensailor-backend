const mongoose = require('mongoose');
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
