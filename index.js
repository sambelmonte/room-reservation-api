const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/', require('./api/index'));

app.listen(port, () => {
  console.log(`API running at port ${port}`);
});