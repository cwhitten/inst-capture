import express from 'express';

const router = new express.Router();

router.get('/', (req, res) => {
  res.send('You made it to the homepage!');
});

export default router;
