// test return of both branches
import getEnvVar from './config';

beforeAll(() => {
  // eslint-disable-next-line no-process-env
  process.env.CANVAS_ID = 'testCanvasId';
});

describe('getting environment variable', () => {
  it('returns variable if defined', () => {
    expect(getEnvVar('CANVAS_ID')).toBe('testCanvasId');
  });

  it('returns undefined if not defined', () => {
    expect(getEnvVar('NOTHING')).toBe(undefined);
  });
});
