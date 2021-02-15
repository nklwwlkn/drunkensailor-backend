const app = require('./app');

const PORT = 8888;

app.listen(PORT, () => {
    console.log(`Server is listening port ${PORT}`);
});
