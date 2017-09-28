/* eslint-disable no-sync */
import fs from 'fs';
import json5 from 'json5';
import {ToolProvider} from '@inst/lti-js';
// eslint-disable-next-line import/no-internal-modules
// import Store from '@inst/lti-js/lib/store/memory';
import path from 'path';

jest.mock('@inst/lti-js');
jest.mock('fs');

fs.readFileSync.mockReturnValue('{"version": "a version"}');
const jsonSpy = jest.spyOn(json5, 'parse');

describe('LTI constructed appropriately', () => {
  // eslint-disable-next-line init-declarations
  let ltiFile;

  /* eslint-disable no-process-env */
  beforeAll(() => {
    process.env.CANVAS_ID = 'testCanvasId';
    process.env.CANVAS_KEY = 'testCanvasKey';
    // eslint-disable-next-line global-require
    ltiFile = require('./index');
  });
  /* eslint-disable no-process-env */

  it('opens lti config from the base file', () => {
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../../config/lti.json'));
  });

  it('opens package.json from the base file', () => {
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../../package.json'));
  });

  it('parses the file that was read', () => {
    expect(jsonSpy).toHaveBeenCalledWith('{"version": "a version"}');
  });

  it('uses hardcoded baseURL value', () => {
    expect(ToolProvider).toHaveBeenCalledWith(
      expect.objectContaining({baseURL: '127.0.0.1:3000'})
    );
  });

  it('uses version from package.json', () => {
    expect(ToolProvider).toHaveBeenCalledWith(
      expect.objectContaining({version: 'a version'})
    );
  });

  it('uses dev id from the environment', () => {
    expect(ToolProvider).toHaveBeenCalledWith(
      expect.objectContaining({devID: 'testCanvasId'})
    );
  });

  it('uses dev key from the environment', () => {
    expect(ToolProvider).toHaveBeenCalledWith(
      expect.objectContaining({devKey: 'testCanvasKey'})
    );
  });

  it('uses template from lti.json', () => {
    expect(ToolProvider).toHaveBeenCalledWith(
      expect.objectContaining({template: {version: 'a version'}})
    );
  });

  it('provides correct number of arguments', () => {
    expect(Object.keys(ToolProvider.mock.calls[0][0]).length).toBe(6);
  });

  describe('lti middleware', () => {
    // eslint-disable-next-line init-declarations
    let ltiMiddleware;

    beforeAll(() => {
      ltiMiddleware = ltiFile.default;
    });

    it('is not null', () => {
      expect(ltiMiddleware).toBeDefined();
    });

    it('is a ToolProvider', () => {
      expect(ltiMiddleware).toBeInstanceOf(ToolProvider);
    });
  });
});
