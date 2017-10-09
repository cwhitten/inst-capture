/* eslint-disable no-sync */
import fs from 'fs';

import openAndParse from './util';

jest.mock('fs');

describe('open and parse', () => {
  it('fails on failed file read', () => {
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    expect(() => {
      openAndParse('somePath');
    }).toThrow();
  });

  it('fails on bad json', () => {
    fs.readFileSync.mockImplementationOnce(() => '{"bad json"}');
    expect(() => {
      openAndParse('somePath');
    }).toThrow();
  });

  it('works on good input', () => {
    fs.readFileSync.mockImplementationOnce(() => '{"version": "a version"}');
    expect(openAndParse('somePath')).toEqual({version: 'a version'});
  });
});
