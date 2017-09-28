import express from 'express';

import routes from './routes';
import lti from './lti';

const app = express();

// add a '/register' route to be used to register this app with Canvas
app.use(lti.registrationRouter);

app.use(routes);

export default app;
