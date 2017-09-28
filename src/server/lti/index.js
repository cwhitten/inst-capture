import {ToolProvider} from '@inst/lti-js';
// eslint-disable-next-line import/no-internal-modules
import MemoryStore from '@inst/lti-js/lib/store/memory';
import json5 from 'json5';
import fs from 'fs';
import path from 'path';

import getEnvVar from '../config';

/* eslint-disable no-sync */
const packageJson = json5.parse(fs.readFileSync(
  path.resolve(__dirname, '../../../package.json')));
const ltiRegistrationRequestTemplate = json5.parse(fs.readFileSync(
  path.resolve(__dirname, '../../../config/lti.json')));
/* eslint-enable no-sync */

const lti = new ToolProvider({
  version:  packageJson.version,
  baseURL:  '127.0.0.1:3000',
  store:    new MemoryStore({}),
  devID:    getEnvVar('CANVAS_ID'),
  devKey:   getEnvVar('CANVAS_KEY'),
  template: ltiRegistrationRequestTemplate,
});

export default lti;
