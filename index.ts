const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const jsonParser = bodyParser.json();

const jokerProgressTemplatePath = './store/joker-progress-template.json';

app.get('/', async (_, res) => {
  const jokerData = require(jokerProgressTemplatePath);
  res.send(jokerData);
});

app.put('/joker/:id', jsonParser, async (req, res) => {
  const id = req.params.id;
  const sticker = req.body.sticker;
  if (!id || !sticker)
    return res
      .status(400)
      .json({ message: 'Missing required fields id or sticker.' });
  const jokerData = require(jokerProgressTemplatePath);
  const oldJoker = jokerData[id];
  if (!oldJoker) return res.status(404).json({ message: 'Joker not found' }); // TODO: check that this doesn't throw error trying to access at id that doesn't exist
  const joker = {
    ...oldJoker,
    sticker: sticker,
  };
  // save to file
  jokerData[id] = joker;
  const fs = require('fs');
  fs.writeFile(
    jokerProgressTemplatePath,
    JSON.stringify(jokerData),
    function (err) {
      if (err) console.log(err);
    },
  );
  res.send(joker);
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});
