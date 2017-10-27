import express from 'express';
import bodyParser from 'body-parser';
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// import HttpStatus from 'http-status-codes';

import lti from '../lti';
// import OAuth from '../oauth';
// import {putRosterJob} from '../../job';

const router = new express.Router();

const roster = [
  {
    name:     'Matt Neldam',
    id:       0,
    isActive: false,
  },
  {
    name:     'Chris Whitten',
    id:       1,
    isActive: false,
  },
  {
    name:     'Andy Brown',
    id:       2,
    isActive: false,
  },
  {
    name:     'Scott Gellock',
    id:       3,
    isActive: false,
  },
  {
    name:     'Kyle Rosenbaum',
    id:       4,
    isActive: false,
  },
  {
    name:     'Dan Lecocq',
    id:       5,
    isActive: false,
  },
  {
    name:     'Ben Yackley',
    id:       6,
    isActive: false,
  },
];

// TODO make these env variables
const twilioAccountSid = 'ACb00cd67be1659c8bd00a88d73e8b2c25';
const twilioApiKey = 'SKb4630a1b81d8caa0cf9526280246985d';
const twilioApiSecret = 'tQMCklAoJ1KxJlJKow1Ld5o5Y9MhN1vh';

// export const oauthHelper = new OAuth({
//   id:        lti.devID,
//   secret:    lti.devKey,
//   oauthPath: '/',
// });
//
// /**
//  * Given a request, return the corresponding agent ID.
//  */
// const agentIdFromRequest = (req) => {
//   /* eslint-disable camelcase */
//   const {custom_CanvasApiDomain, custom_CanvasAccountId} = req.body;
//
//   if (custom_CanvasApiDomain === undefined) {
//     throw new Error(HttpStatus.BAD_REQUEST, 'Canvas domain undefined');
//   }
//   if (custom_CanvasAccountId === undefined) {
//     throw new Error(HttpStatus.BAD_REQUEST, 'Account ID undefined');
//   }
//   return `${custom_CanvasApiDomain}:${custom_CanvasAccountId}`;
//   /* eslint-enable camelcase */
// };
//
// router.use(oauthHelper.oauthPath, oauthHelper.oauthHandler);

// router.post('/lti/roster', lti.authMiddleware,
//   (req: $Request, res: $Response) =>
//     putRosterJob({
//       agentId: agentIdFromRequest(req),
//     }).then(() => {
//       res.send('Job created');
// }))

/* eslint-disable */
router.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Access-Control-Allow-Headers');
  next();
});

// twilio account SID for the account that will receive the token
// API key SID public identifier of key used to sign the token
// identity grant (?) sets the twilio user identifier for the client "holding"
// the token
// API key secret associated with the API key SID used to sign the access token
// video grant
// room grant?
router.get('/token',
  bodyParser.urlencoded({extended: false}),
  (req, res) => {
    const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
    token.identity = req.query.identity;
    const grant = new VideoGrant();
    token.addGrant(grant);
    res.send({
      token: token.toJwt(),
    })
  }
)

router.get('/users',
  // await the response of GET on canvas?
  // GET /api/v1/courses/:course_id/users

  (req, res) => {
    res.send(roster);
});

router.get('/users/:id',
  (req, res) => {
  res.send(roster[req.params.id]);
})

router.post('/twilio',
  bodyParser.urlencoded({extended: false}),
  (req, res) => {
    const {body} = req;
    // body contains the ID
    const index = parseInt(body.ParticipantIdentity);
    if (index !== -1) {
      if (body.ParticipantStatus === 'connected') {
        roster[index] = {
          ...roster[index],
          isActive: true,
        }
      }
      if (body.ParticipantStatus === 'disconnected') {
        roster[index] = {
          ...roster[index],
          isActive: false,
        }
      }
    }
    res.send('OK')
  })

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
