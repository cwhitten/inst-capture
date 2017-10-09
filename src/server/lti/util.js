import json5 from 'json5';
import fs from 'fs';
import path from 'path';

export default function openAndParseSync(filePath) {
  try {
    // eslint-disable-next-line no-sync
    return json5.parse(fs.readFileSync(
      path.resolve(__dirname, filePath)));
  } catch (e) {
    throw new Error(`could not open or parse ${filePath}`, e);
  }
}
