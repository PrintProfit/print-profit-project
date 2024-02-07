// @ts-check
import { Router } from 'express';
import { z } from 'zod';
import {
  rejectNonAdmin,
  rejectUnapproved,
  rejectUnauthenticated,
} from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { encryptPassword } from '../modules/encryption.js';
import pool from '../modules/pool.js';
import {
  ApproveUserBody,
  RecoverUserBody,
  SoftDeleteUserBody,
} from '../schemas/admin.js';
import { RegisterBody } from '../schemas/auth.js';
import userStrategy from '../strategies/user.strategy.js';

const router = Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  // rejectUnauthenticated already checks that the user wasn't removed
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post(
  '/register',
  validate(z.object({ body: RegisterBody })),
  (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = encryptPassword(req.body.password);

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
        ("user_id", "name", "updated_by")
        VALUES
        ($1, $2, $3);
    `;

        const insertNewUserValues = [
          createdUserId,
          req.body.companyName,
          createdUserId,
        ];

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
  },
);

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

// Gets all companys from company table
router.get('/company', rejectNonAdmin, (req, res) => {
  const query = `
  SELECT * FROM "company";
  `;

  pool
    .query(query)
    .then((result) => {
      // Creates array of all of the company names in strings
      // const companyArray = result.rows.map((row) => row.name);
      // res.send(companyArray);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all company names', err);
      res.sendStatus(500);
    });
});

// Gets all pending users
router.get('/pending', rejectNonAdmin, (req, res) => {
  const query = `
  SELECT "user"."id" as "user_id",
  "user"."email" as "email",
  "user"."name" as "user_name",
  "user"."is_approved" as "is_approved",
  "user"."inserted_at" as "created_at",
  "pending_user_company"."name" as "pending_company_name",
  "pending_user_company"."id" as "pending_company_id"
      FROM "user"
  INNER JOIN "pending_user_company"
      ON "user"."id" = "pending_user_company"."id"
  WHERE "user"."is_approved" = FALSE AND "user"."is_removed" = FALSE; 
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all users that are pending', err);
      res.sendStatus(500);
    });
});

// Gets all of the approved users
router.get('/approved', rejectNonAdmin, (req, res) => {
  const query = `
  SELECT "user"."id" as "user_id",
  "user"."email" as "email",
  "user"."name" as "user_name",
  "user"."is_approved" as "is_approved",
  "user"."inserted_at" as "created_at",
  "company"."name" as "company_name",
  "company"."id" as "company_id"
      FROM "user"
  INNER JOIN "company"
      ON "user"."company_id" = "company"."id"
  WHERE "user"."is_approved" = TRUE AND "user"."is_removed" = FALSE;
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all users that are approved', err);
      res.sendStatus(500);
    });
});

// approves the user that the admin clicked
router.put(
  '/approve',
  rejectNonAdmin,
  validate(z.object({ body: ApproveUserBody })),
  (req, res) => {
    const sqlText = `
  UPDATE "user"
    SET "is_approved" = TRUE, "updated_by" = $1, "company_id" = $2
  WHERE "id" = $3;
        `;

    const insertValue = [
      req.user.id,
      req.body.companyId,
      req.body.pendingUserId,
    ];
    pool
      .query(sqlText, insertValue)
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('Error in user.router /approve PUT,', err);
        res.sendStatus(500);
      });
  },
);

// soft deletes the user the admin clicked
router.put(
  '/delete/soft',
  rejectNonAdmin,
  validate(z.object({ body: SoftDeleteUserBody })),
  (req, res) => {
    const sqlText = `
  UPDATE "user"
    SET "is_removed" = TRUE, "updated_by" = $1
  WHERE "id" = $2;
        `;

    const insertValue = [req.user.id, req.body.aboutToBeDeletedUser];
    pool
      .query(sqlText, insertValue)
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('Error in user.router /delete/soft PUT,', err);
        res.sendStatus(500);
      });
  },
);

// recovers the user the admin clicked
router.put(
  '/recover',
  rejectNonAdmin,
  validate(z.object({ body: RecoverUserBody })),
  (req, res) => {
    const sqlText = `
  UPDATE "user"
    SET "is_removed" = FALSE, "updated_by" = $1
  WHERE "id" = $2;
        `;

    const insertValue = [req.user.id, req.body.aboutToBeRecoveredUser];
    pool
      .query(sqlText, insertValue)
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('Error in user.router /recover PUT,', err);
        res.sendStatus(500);
      });
  },
);

// Gets the user that is logged in for the profile page
router.get('/profile/page', rejectUnapproved, (req, res) => {
  const query = `
  SELECT "user"."id" as "user_id",
  "user"."email" as "email",
  "user"."name" as "user_name",
  "user"."is_approved" as "is_approved",
  "user"."inserted_at" as "created_at",
  "company"."name" as "company_name",
  "company"."id" as "company_id"
      FROM "user"
  INNER JOIN "company"
      ON "user"."company_id" = "company"."id"
  WHERE "user"."id" = $1 AND "user"."is_removed" = FALSE;
  `;

  const sqlValues = [req.user.id];

  pool
    .query(query, sqlValues)
    .then((result) => {
      res.send(result.rows[0]);
    })
    .catch((err) => {
      console.log('ERROR: Get all users for profile page', err);
      res.sendStatus(500);
    });
});

router.post('/company', (req, res) => {
  // console.log('req.body', req.body);

  const insertQuery = `
  INSERT INTO "company" 
  ("name", "updated_by")
  VALUES
  ($1, $2) RETURNING "id";
      `;
  const insertValue = [req.body.newCompanyName, req.user.id];

  pool
    .query(insertQuery, insertValue)
    .then((result) => {
      // console.log('result', result);
      res.send(result.rows[0]);
    })
    .catch((err) => {
      console.log('err in company post route', err);
      res.sendStatus(500);
    });
});

// hard deletes users that are in the archived table
router.delete('/delete/archived', (req, res) => {
  const sqlText = `
  DELETE FROM "user"
    WHERE "id" = $1;
    `;

  const insertValue = [req.body.aboutToBeDeletedUser];

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('Error in user.router DELETE, deleting account', err);
      res.sendStatus(500);
    });
});

// Gets all users that have been soft delete
router.get('/archived', (req, res) => {
  // console.log('im in company route');

  const query = `
  SELECT "user"."id" as "user_id",
  "user"."email" as "email",
  "user"."name" as "user_name",
  "user"."is_approved" as "is_approved",
  "user"."inserted_at" as "created_at"
      FROM "user"
  WHERE "user"."is_removed" = TRUE;
  `;

  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all users that are archived', err);
      res.sendStatus(500);
    });
});

// user saving changes to users info in DB
router.put('/edit/info', (req, res) => {
  // console.log('req.body', req.body.newPasswordInput);

  let sqlText;
  let insertValue;

  const newEmailInput = req.body.newEmailInput;
  const newNameInput = req.body.newNameInput;

  if (req.body.newPasswordInput === undefined) {
    sqlText = `
  UPDATE "user"
  SET "email" = $1, "name" = $2, "updated_by" = $3
WHERE "id" = $3;
        `;

    insertValue = [newEmailInput, newNameInput, req.user.id];
  } else {
    const newPasswordInput = encryptPassword(req.body.newPasswordInput);

    sqlText = `
  UPDATE "user"
  SET "email" = $1, "name" = $2, "password" = $3, "updated_by" = $4
WHERE "id" = $4;
        `;

    insertValue = [newEmailInput, newNameInput, newPasswordInput, req.user.id];
  }

  pool
    .query(sqlText, insertValue)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('Error in user.router /edit/info PUT,', err);
      res.sendStatus(500);
    });
});

router.post('/admin/create/company/user', (req, res) => {
  // Now handle the company reference:
  const insertNewUserQuery = `
      INSERT INTO "company"
        ("name", "updated_by")
        VALUES
        ($1, $2) RETURNING "id";
    `;

  console.log('req.body.companyName', req.body.companyName);

  const insertNewUserValues = [req.body.companyName, req.user.id];

  pool
    .query(insertNewUserQuery, insertNewUserValues)
    .then((result) => {
      // console.log('newUserId:', result.rows[0].id);
      const newCompanyId = result.rows[0].id;

      const email = req.body.email;
      const name = req.body.name;
      const password = encryptPassword(req.body.password);

      const queryText = `INSERT INTO "user" (email, name, password, "company_id", "updated_by", "is_approved")
        VALUES ($1, $2, $3, $4, $5, TRUE);`;

      pool
        .query(queryText, [email, name, password, newCompanyId, req.user.id])
        .then((result) => res.sendStatus(201));
    })
    .catch((err) => {
      // catch for second query
      console.log('2nd admin create user and company post query fails', err);
      res.sendStatus(500);
    })
    .catch((err) => {
      // catch for first query
      console.log('admin create user and company post failed: ', err);
      res.sendStatus(500);
    });
});

router.post('/admin/create/user', (req, res) => {
  // console.log('req.body', req.body);
  const email = req.body.email;
  const name = req.body.name;
  const companyId = req.body.companyId;
  const password = encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (email, name, password, "company_id", "updated_by", "is_approved")
  VALUES ($1, $2, $3, $4, $5, TRUE);`;

  pool
    .query(queryText, [email, name, password, companyId, req.user.id])
    .then((result) => {
      // console.log('result', result);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('err in admin user post route', err);
      res.sendStatus(500);
    });
});

export default router;
