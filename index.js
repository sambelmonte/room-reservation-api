const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use('/', require('./api/index'));

app.listen(port, () => {
  console.log(`API running at port ${port}`);
});