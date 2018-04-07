import express from 'express';
import loginToNike from './loginToNike';
import bodyParser from 'body-parser';
import queue from 'express-queue';

const app = express();
const jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.get('/', (req, res) => res.json('Hello Nike!'));
app.use('/login', queue({ activeLimit: 1, queuedLimit: -1 }));
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const nikeAuthPayload = await loginToNike(login, password);
  res.json(nikeAuthPayload);
});

app.listen(3000, function() {
  console.log('Nike api listening on port 3000!');
});
