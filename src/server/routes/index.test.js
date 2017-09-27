import express from 'express';
import request from 'supertest';

import router from './index';

const app = express();

app.use(router);

describe('/ route', () => {
  it('returns 200 status code', () =>
    // Return the promise (Jest will wait for its completion).
    request(app)
      .get('/')
      .expect(200)
  );
});
