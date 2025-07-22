const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const jsonParser = bodyParser.json();

const jokerProgressTemplatePath = './store/joker-progress-template.json';
const jokerProgressPath = './store/joker-progress.json';

const fetchJokerProgress = () => {
  const fs = require('fs');
  const jokerData = fs.existsSync(jokerProgressPath)
    ? require(jokerProgressPath)
    : require(jokerProgressTemplatePath);
  return jokerData;
};

app.get('/', async (_, res) => {
  const jokerData = fetchJokerProgress();
  const jokers = Object.keys(jokerData).map((key) => {
    return {
      id: parseInt(key),
      ...jokerData[key],
    };
  });
  res.send(jokers);
});

app.put('/joker/:id', jsonParser, async (req, res) => {
  const id = req.params.id;
  const sticker = req.body.sticker;
  if (!id || !sticker)
    return res
      .status(400)
      .json({ message: 'Missing required fields id or sticker.' });
  const fs = require('fs');
  const jokerData = fetchJokerProgress();
  const oldJoker = jokerData[id];
  if (!oldJoker) return res.status(404).json({ message: 'Joker not found' }); // TODO: check that this doesn't throw error trying to access at id that doesn't exist
  const joker = {
    ...oldJoker,
    sticker: sticker,
  };
  // save to file
  jokerData[id] = joker;
  fs.writeFile(jokerProgressPath, JSON.stringify(jokerData), function (err) {
    if (err) console.log(err);
  });
  res.send(joker);
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});
