// /* eslint-disable */
import Path from 'path';
import {URL} from 'url';

import bodyParser from 'body-parser';
import HttpStatus from 'http-status-codes';
import Promise from 'bluebird';
import request from 'request';
import {Router} from 'express';
import uuid from 'uuid';
import type {$Request, $Response, NextFunction} from 'express';

Promise.promisifyAll(request);

/**
 * This helper aids with the OAuth workflow.
 *
 * It provides a piece of middleware that will either provide the OAuth creds
 * associated with a LTI launch request, OR it will begin the OAuth handshake
 * process to obtain them.
 *
 * Options:
 *  - id (required) - the ID of the Canvas developer key
 *  - secret (require) - the Canvas developer key secret
 *  - oauthPath (optional) - the absolute path the oauth handler was mounted
 */
export default class OAuthHelper {
  constructor(options) {
    if (options.id === undefined || options.secret === undefined) {
      throw new Error('Options "id" and "secret" must both be specified.');
    }
    this.id = options.id;
    this.secret = options.secret;
    // TODO(dan): these need to be persistently stored. The states also need to
    // expire over time.
    this.states = {};
    this.creds = {};
    this.oauthPath = options.oauthPath || '/';
  }

  /**
   * Returns a promise that resolves with the fetched credential.
   */
  getCreds(key) {
    return Promise.resolve(this.creds[key]);
  }

  /**
   * Returns a promise that resolves when the credential is stored.
   */
  saveCreds(key, creds) {
    return Promise.try(() => {
      this.creds[key] = creds;
      return creds;
    });
  }

  /**
   * Returns a promise that resolves with the fetched state, after it has been
   * deleted.
   */
  popState(key) {
    return Promise.try(() => {
      const state = this.states[key];

      delete this.states[key];
      return state;
    });
  }

  /**
   * Returns a promise that resolves when the state has been saved.
   */
  saveState(key, state) {
    return Promise.try(() => {
      this.states[key] = state;
      return state;
    });
  }

  /**
   * This middleware adds the appropriate account's OAuth creds to the request
   * if they're already saved. Otherwise, it begins the handshake to obtain and
   * then save them. The workflow for that is:
   *
   * 1. Redirect to Canvas authorization page - this page prompts the user to
   *    authorize our app to retrieve credentials, which triggers Canvas to make
   *    a request back to our app. To associate this LTI launch request with the
   *    subsequent request, we pass along a `state` query parameter in the
   *    redirect, which will be provided in the later Canvas request.
   * 2. Handle authorization request from Canvas - this includes the `state`
   *    parameter we provided in step 1, as well as a code that we use to
   *    request OAuth creds. Upon the fetching and storing these creds, we can
   *    respond to this request.
   */
  get middleware() {
    return (req, res, next) => {
      // TODO(dan) make sure that these two values exist
      const canvasDomain = req.body.custom_CanvasApiDomain;
      const accountID = req.body.custom_CanvasAccountId;
      const user = `${canvasDomain}:${accountID}`;
      const host = new URL('/', req.headers.origin).href;

      this.getCreds(user)
        .then((creds) => {
          if (creds === undefined) {
            return this.authRedirect(req, user, host)
              .then((target) => res.redirect(HttpStatus.MOVED_TEMPORARILY, target));
          }

          // $FlowFixMe, add custom attribute 'oauth' to $Request
          req.oauth = {
            ...creds,
            host,
          };
          return next();
        })
        .catch(next);
    };
  }

  /**
   * Return a promise that resolves with the appropriate URL for Canvas oauth
   * authorization, only once the relevant state has been saved.
   */
  authRedirect(req, user, host) {
    const key = `${user}:${uuid.v4()}`;
    const path = Path.join(this.oauthPath, 'oauth');
    const redirect = new URL(path, `${req.protocol}://${req.hostname}`).href;
    const state = {
      user,
      redirect,
      host,
    };

    return this.saveState(key, state)
      .then(() => {
        const target = new URL(`${host}login/oauth2/auth`);

        target.searchParams.set('state', key);
        target.searchParams.set('client_id', this.id);
        target.searchParams.set('response_type', 'code');
        target.searchParams.set('redirect_uri', redirect);
        return target.href;
      });
  }

  /**
   * Returns a promise that resolves to the creds, after they've been saved.
   */
  requestCreds(code, state) {
    return request
      .postAsync({
        url: new URL('/login/oauth2/token', state.host).href,
        headers: {
          Accept: 'application/json',
        },
        form: {
          /* eslint-disable camelcase */
          grant_type: 'authorization_code',
          client_id: this.id,
          client_secret: this.secret,
          redirect_uri: state.redirect,
          code,
          /* eslint-enable camelcase */
        },
      })
      .then((response) => {
        if (response.statusCode !== HttpStatus.OK) {
          throw new Error('Unable to get OAuth creds');
        }
        this.saveCreds(state.user, response.body);
        return response.body;
      });
  }

  get oauthHandler() {
    // eslint-disable-next-line new-cap
    const router = Router();

    router.use('/oauth', bodyParser.json(), (req: $Request, res: $Response, next: NextFunction) =>
      this.popState(req.query.state)
        .then((state) => this.requestCreds(req.query.code, state))
        .then(() => {
          res.json({
            status: 'success',
            message: 'Successfully saved credentials',
          });
        })
        .catch(next));
    return router;
  }
  
