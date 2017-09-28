/* eslint-disable no-process-env */

export default function getEnvVar(envVar) {
  if (process.env.hasOwnProperty(envVar)) {
    return process.env[envVar];
  }
  return undefined;
}
