import express from 'express';
import loginToNike from './loginToNike';
import bodyParser from 'body-parser';

const app = express();
const jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.get('/', (req, res) => res.json('Hello Nike!'));
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const nikeAuthPayload = await loginToNike(login, password);
  res.json(nikeAuthPayload);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
