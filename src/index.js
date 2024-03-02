const createApp = require('./app');
const app = createApp();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Mi port ${port}`);
});
