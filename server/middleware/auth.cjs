// @ts-check

/** @type {import("express").RequestHandler} */
const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated() && !req.user.is_removed) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

/** @type {import("express").RequestHandler} */
const rejectUnapproved = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.is_removed && req.user.is_approved) {
    next();
  } else {
    res.sendStatus(403);
  }
};

/** @type {import("express").RequestHandler} */
const rejectNonAdmin = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.is_removed && req.user.is_admin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, rejectUnapproved, rejectNonAdmin };
