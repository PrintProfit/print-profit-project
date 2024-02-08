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
  CreateCompanyBody,
  CreateCompanyUserBody,
  CreateUserBody,
  DeleteUserBody,
  RecoverUserBody,
} from '../schemas/admin.js';
import { EditUserBody, RegisterBody } from '../schemas/users.js';
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
  async (req, res) => {
    const conn = await pool.connect();
    const { email, name, password, companyName } = req.body;

    try {
      await conn.query('BEGIN');
      const hashedPassword = encryptPassword(password);

      const result = await conn.query(
        `--sql
          INSERT INTO "user" (
            email,
            name,
            password
          )
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [email, name, hashedPassword],
      );
      const userId = result.rows[0].id;

      await conn.query(
        `--sql
          INSERT INTO pending_user_company (
            user_id,
            name,
            updated_by
          )
          VALUES ($1::integer, $2::text, $1::integer)
        `,
        [userId, companyName],
      );

      await conn.query('COMMIT');
      res.sendStatus(201);
    } catch (error) {
      await conn.query('ROLLBACK');
      console.log('Error in user.router /register POST,', error);
    } finally {
      conn.release();
    }
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
      ON "user"."id" = "pending_user_company"."user_id"
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
      req.user?.id,
      req.body.companyId,
      req.body.pendingUserId,
    ];
    pool
      .query(sqlText, insertValue)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('Error in user.router /approve PUT,', err);
        res.sendStatus(500);
      });
  },
);

// hard deletes pending users company
router.delete(
  '/delete/pending/company',
  rejectNonAdmin,
  // validate(z.object({ body: DeleteUserBody })),
  (req, res) => {
    const sqlText = `
  DELETE FROM "pending_user_company"
    WHERE "user_id" = $1;
    `;

    const insertValue = [req.body.pendingUserId];

    pool
      .query(sqlText, insertValue)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('Error in user.router DELETE, deleting account', err);
        res.sendStatus(500);
      });
  },
);

// soft deletes the user the admin clicked
router.put(
  '/delete/soft',
  rejectNonAdmin,
  validate(z.object({ body: DeleteUserBody })),
  (req, res) => {
    const sqlText = `
  UPDATE "user"
    SET "is_removed" = TRUE, "updated_by" = $1
  WHERE "id" = $2;
        `;

    const insertValue = [req.user?.id, req.body.aboutToBeDeletedUser];
    pool
      .query(sqlText, insertValue)
      .then(() => {
        res.sendStatus(200);
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

    const insertValue = [req.user?.id, req.body.aboutToBeRecoveredUser];
    pool
      .query(sqlText, insertValue)
      .then(() => {
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

  const sqlValues = [req.user?.id];

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

router.post(
  '/company',
  rejectNonAdmin,
  validate(z.object({ body: CreateCompanyBody })),
  (req, res) => {
    const insertQuery = `
  INSERT INTO "company" 
  ("name", "updated_by")
  VALUES
  ($1, $2) RETURNING "id";
      `;
    const insertValue = [req.body.newCompanyName, req.user?.id];

    pool
      .query(insertQuery, insertValue)
      .then((result) => {
        res.send(result.rows[0]);
      })
      .catch((err) => {
        console.log('err in company post route', err);
        res.sendStatus(500);
      });
  },
);

// hard deletes users that are in the archived table
router.delete(
  '/delete/archived',
  rejectNonAdmin,
  validate(z.object({ body: DeleteUserBody })),
  (req, res) => {
    const sqlText = `
  DELETE FROM "user"
    WHERE "id" = $1;
    `;

    const insertValue = [req.body.aboutToBeDeletedUser];

    pool
      .query(sqlText, insertValue)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('Error in user.router DELETE, deleting account', err);
        res.sendStatus(500);
      });
  },
);

// Gets all users that have been soft delete
router.get('/archived', rejectNonAdmin, (req, res) => {
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
router.put(
  '/edit/info',
  rejectUnapproved,
  validate(z.object({ body: EditUserBody })),
  async (req, res) => {
    const {
      newEmailInput: email,
      newNameInput: name,
      newPasswordInput: password,
    } = req.body;

    try {
      if (password) {
        const hashedPassword = encryptPassword(password);
        await pool.query(
          `--sql
            UPDATE "user"
            SET
              email = $1,
              name = $2,
              password = $3,
              updated_by = $4
            WHERE id = $4
          `,
          [email, name, hashedPassword, req.user?.id],
        );
      } else {
        await pool.query(
          `--sql
            UPDATE "user"
            SET
              email = $1,
              name = $2,
              updated_by = $3
            WHERE id = $3
          `,
          [email, name, req.user?.id],
        );
      }
      res.sendStatus(201);
    } catch (error) {
      console.log('Error in user.router /edit/info PUT,', error);
      res.sendStatus(500);
    }
  },
);

router.post(
  '/admin/create/company/user',
  rejectNonAdmin,
  validate(z.object({ body: CreateCompanyUserBody })),
  async (req, res) => {
    const conn = await pool.connect();

    const { companyName, email, name, password } = req.body;

    try {
      await conn.query('BEGIN');
      const result = await conn.query(
        `--sql
          INSERT INTO company (name, updated_by)
          VALUES ($1, $2)
          RETURNING id
        `,
        [companyName, req.user?.id],
      );
      const companyId = result.rows[0].id;
      const hashedPassword = encryptPassword(password);
      await conn.query(
        `--sql
          INSERT INTO "user" (
            email,
            name,
            password,
            company_id,
            updated_by,
            is_approved
          )
          VALUES ($1, $2, $3, $4, $5, TRUE)
        `,
        [email, name, hashedPassword, companyId, req.user?.id],
      );
      await conn.query('COMMIT');
      res.sendStatus(201);
    } catch (error) {
      console.log('Error in admin create user route', error);
      await conn.query('ROLLBACK');
      res.sendStatus(500);
    } finally {
      conn.release();
    }
  },
);

router.post(
  '/admin/create/user',
  rejectNonAdmin,
  validate(z.object({ body: CreateUserBody })),
  (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const companyId = req.body.companyId;
    const password = encryptPassword(req.body.password);

    const queryText = `INSERT INTO "user" (email, name, password, "company_id", "updated_by", "is_approved")
  VALUES ($1, $2, $3, $4, $5, TRUE);`;

    pool
      .query(queryText, [email, name, password, companyId, req.user?.id])
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('err in admin user post route', err);
        res.sendStatus(500);
      });
  },
);

export default router;
