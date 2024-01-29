const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  // not right names yet
  const email = req.body.email;
  const name = req.body.name;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (email, name, password)
    VALUES ($1, $2, $3) RETURNING id`;

  pool
    .query(queryText, [email, name, password])
    .then((result) => {
      // ID IS HERE!
      console.log('New user Id:', result.rows[0].id);
      const createdUserId = result.rows[0].id;

      // Now handle the pending_user_company reference:
      const insertNewUserQuery = `
      INSERT INTO "pending_user_company"
        ("user_id", "name")
        VALUES
        ($1, $2);
    `;

      const insertNewUserValues = [createdUserId, req.body.companyName];

      pool.query(insertNewUserQuery, insertNewUserValues)

      .then(() => res.sendStatus(201));
    })
    .catch((err) => {
      // catch for second query
      console.log('2nd register query fails', err);
      res.sendStatus(500);
    })
    .catch((err) => {
      // catch for first query
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.get('/company', (req, res) => {
  // console.log('im in company route');

  const query = `
    SELECT * FROM "company";
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all company names', err);
      res.sendStatus(500);
    });
});

module.exports = router;
