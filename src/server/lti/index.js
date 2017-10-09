import {ToolProvider} from '@inst/lti-js';
// eslint-disable-next-line import/no-internal-modules
import MemoryStore from '@inst/lti-js/lib/store/memory';
import merge from 'lodash.merge';

import openAndParseSync from './util';
import getEnvVar from '../config';

const packageJson = openAndParseSync('../../../package.json');
const ltiDescriptionTemplate = openAndParseSync('../../../config/lti-description.json');
const ltiResourcesTemplate = openAndParseSync('../../../config/lti-resources.json');

// TODO add this to lti-js
/* eslint-disable camelcase */
const ltiStaticRequestTemplate = {
  '@context':         ['http://purl.imsglobal.org/ctx/lti/v2/ToolProxy'],
  '@type':            'ToolProxy',
  lti_version:        'LTI-2p1',
  tool_profile:       {lti_version: 'LTI-2p1'},
  security_contract: {
    // random hex string generated at runtime and shared with server
    tp_half_shared_secret: null,
  },
  enabled_capability: ['OAuth.splitSecret'],
};
/* eslint-enable camelcase */

const ltiRegistrationRequestTemplate = merge(
  ltiStaticRequestTemplate,
  ltiDescriptionTemplate,
  ltiResourcesTemplate
);

const lti = new ToolProvider({
  version:  packageJson.version,
  baseURL:  'http://127.0.0.1:3000/',
  store:    new MemoryStore({}),
  devID:    getEnvVar('CANVAS_ID'),
  devKey:   getEnvVar('CANVAS_KEY'),
  template: ltiRegistrationRequestTemplate,
});

export default lti;
