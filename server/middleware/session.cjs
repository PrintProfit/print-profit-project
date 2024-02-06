// @ts-check

const expressSession = require('express-session');
const createPGStore = require('connect-pg-simple');
const { badSecret, exampleBadSecret } = require('../constants/warnings');
const pool = require('../modules/pool');

const PGStore = createPGStore(expressSession);

function serverSessionSecret() {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === exampleBadSecret
  ) {
    // Warning if user doesn't have a good secret
    console.log(badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
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

module.exports = { session: middleware };
