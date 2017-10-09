import express from 'express';
import request from 'supertest';

// eslint-disable-next-line no-unused-vars
import lti from '../lti';
import router from './index';

const app = express();

jest.mock('../lti', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    next();
  }),
}));

app.use(router);

describe('/ route', () => {
  it('returns 200 status code', () =>
    // Return the promise (Jest will wait for its completion).
    request(app)
      .get('/')
      .expect(200)
  );
});

// TODO make a post that fails, make a post that succeeds
describe('authenticated route', () => {
  /* eslint-disable camelcase */
  it('returns 200 for good post', () =>
    request(app)
      .post('/lti_check')
      .send({})
      .expect(200)
  );
});
