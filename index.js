const express = require('express');
const app = express();

app.use(express.json());

app.use('/', require('./api/index'));

app.listen(3000);