import express, { json } from 'express';
const app = express();

app.user(json());

app.use('/', require('./api/index').default.default);

app.listen(3000);