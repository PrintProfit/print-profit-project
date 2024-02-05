// @ts-check

const expressSession = require('express-session');
const createMemoryStore = require('memorystore');
const { badSecret, exampleBadSecret } = require('../constants/warnings');

const MemoryStore = createMemoryStore(expressSession);

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
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: serverSessionSecret() ?? 'CHANGEME',
});

module.exports = { session: middleware };
