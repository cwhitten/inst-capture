import express from 'express';
import bodyParser from 'body-parser';

// const AccessToken = require('twilio').jwt.AccessToken;

// const VideoGrant = AccessToken.VideoGrant;

import lti from '../lti';

const router = new express.Router();
const students = [
  {
    name: 'Matt Neldam',
    id: 0,
    loggedIn: false,
  },
  {
    name: 'Chris Whitten',
    id: 1,
    loggedIn: false,
  },
];

// generate an access token for the user
// this route should be
router.post('/twilio',
  bodyParser.urlencoded({extended: false}),
  (req, res) => {
    const {body} = req;
    console.log(body.RoomStatus, body.ParticipantStatus, body.StatusCallbackEvent);
  });

router.get('/twilio',
  (req, res) => {
    const {body} = req;
    students[0] = {
      name: 'Matt Neldam',
      id: 0,
      loggedIn: true,
    };
    console.log(body.RoomStatus, body.ParticipantStatus, body.StatusCallbackEvent);
  });

/* eslint-disable */
router.get('/users',
  // await the response of GET on canvas?
  // GET /api/v1/courses/:course_id/users

  (req, res) => {
    res.send(students);
});

router.post('/lti_check',
  lti.authMiddleware,
  // spin off the GET request to Canvas?
  bodyParser.urlencoded({extended: true}),
  (req, res) => {
    const {body} = req;
    const response = `Hi ${body.lis_person_name_full}! You made it to the
      authenticated route.`;

    res.send(response);
  }
);

export default router;
