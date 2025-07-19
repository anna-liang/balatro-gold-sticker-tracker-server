const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', async (_, res) => {
  const jokerData = require('./store/joker-progress-template.json');
  res.send(jokerData);
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});
