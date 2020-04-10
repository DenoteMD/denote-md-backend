import express from 'express';

const router = express.Router();

router.get('/', (_req: express.Request, res: express.Response) => {
  res.json({ message: 'Ping Successfull' });
});
