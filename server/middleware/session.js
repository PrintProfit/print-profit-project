// @ts-check

import createPGStore from 'connect-pg-simple';
import expressSession from 'express-session';
import { badSecret, exampleBadSecret } from '../constants/warnings.js';
import pool from '../modules/pool.js';

const PGStore = createPGStore(expressSession);

function serverSessionSecret() {
  if (
    !process.env['SERVER_SESSION_SECRET'] ||
    process.env['SERVER_SESSION_SECRET'].length < 8 ||
    process.env['SERVER_SESSION_SECRET'] === exampleBadSecret
  ) {
    // Warning if user doesn't have a good secret
    console.log(badSecret);
  }

  return process.env['SERVER_SESSION_SECRET'];
}

const middleware = expressSession({
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  store: new PGStore({
    pool,
  }),
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: serverSessionSecret() ?? 'CHANGEME',
});

export const session = middleware;
