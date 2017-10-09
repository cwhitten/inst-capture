import express from 'express';
import bodyParser from 'body-parser';

import lti from '../lti';

const router = new express.Router();

router.get('/', (req, res) => {
  res.send('You made it to the homepage!');
});

router.post('/lti_check',
  lti.authMiddleware,
  bodyParser.urlencoded({extended: true}),
  (req, res) => {
    const {body} = req;
    const response = `Hi ${body.lis_person_name_full}! You made it to the
      authenticated route.`;

    res.send(response);
  }
);

export default router;
