import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
  res.sendStatus(400);
});

export default app;
