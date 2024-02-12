// @ts-check
import { Router } from 'express';
import { z } from 'zod';
import { rejectUnapproved } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import pool from '../modules/pool.js';
import { SaveQuoteBody, UpdateQuoteBody } from '../schemas/quotes.js';

const router = Router();

router.use(rejectUnapproved);

// GET all quotes
router.get('/:id', (req, res) => {
  const query = /*sql*/ `
  SELECT
	json_build_object(
		'quotes', json_agg(
			json_build_object(
				'id',
					q.id,
				'name',
					q.name,
				'user_id',
					q.user_id,
				'manual_total_selling_price',
					q.manual_total_selling_price,
				'manual_contribution_percent',
					q.manual_contribution_percent,
        'inserted_at',
          q.inserted_at,
        'created_by',
         	u.name,
				'products',
					products
				)
		)
	) quotes
	FROM quote q
	left join (
		select
			quote_id,
			json_agg(
				json_build_object(
				'id',
					p.id,
				'name',
					p.name,
				'quantity',
					p.quantity,
				'selling_price_per_unit',
					p.selling_price_per_unit,
				'total_selling_price',
					p.total_selling_price,
				'estimated_hours',
					p.estimated_hours,
				'costs',
					costs
				)
			) products
	FROM
		product p
		left join (
		select
			product_id,
			json_agg(
			json_build_object(
        'id',
          c.id,
				'name',
					c.name,
				'value',
					c.value
				)
			) costs
		 from cost c
		group by 1
	) c on p.id = c.product_id
	group by quote_id
) p on q.id = p.quote_id
  	INNER JOIN "user" u on q.user_id = u.id
  		WHERE u.company_id = $1 AND q.is_removed = false;`;
  const values = [req.user?.company_id];
  pool
    .query(query, values)
    .then((dbRes) => {
      console.log('dbRes.rows: ', dbRes.rows);
      res.send(dbRes.rows[0]);
    })
    .catch((dbErr) => {
      res.sendStatus(500);
    });
});

// An example post and put requests are in ../../docs/requests/save-quote-post-body.jsonc

// POST quotes route
router.post(
  '/',
  validate(z.object({ body: SaveQuoteBody })),
  async (req, res) => {
    const connection = await pool.connect();

    try {
      console.log('quote post req.body:', req.body);

      // Establishes a longstanding connection to our database:

      // BEGIN the SQL Transaction:
      await connection.query('BEGIN;');

      // first query inserts quote name and user_id into quote table ==> 🔥 need to get user_id from user state
      // QUOTE POST
      const quoteQuery = `
      INSERT INTO "quote"
        ("user_id", "name", "manual_total_selling_price", "manual_contribution_percent")
        VALUES
        ($1, $2, $3, $4)
        RETURNING "id";
     `;
      const quoteValues = [
        req.user?.id,
        req.body.name,
        req.body.manual_total_selling_price,
        req.body.manual_contribution_percent,
      ];
      // query returns id from the inserted quote
      const returnedQuoteIdRows = await connection.query(
        quoteQuery,
        quoteValues,
      );
      // END QUOTE POST
      console.log('returnedQuoteIdRows: ', returnedQuoteIdRows);
      // should give us the posted quote's id number
      const quoteId = returnedQuoteIdRows.rows[0].id;

      // PRODUCT(S) POST
      const productQuery = `
      INSERT INTO "product"
        ("quote_id", "name", "quantity", "selling_price_per_unit", "total_selling_price", "estimated_hours")
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING "id";
    `;

      const quoteProductArray = req.body.products;
      console.log('quote post req.body.products:', quoteProductArray);

      // loops over array of products belonging to the posted quote
      for (const product of quoteProductArray) {
        // array of sql values to insert into product table
        const productValues = [
          quoteId,
          product.name,
          product.quantity,
          product.selling_price_per_unit,
          product.total_selling_price,
          product.estimated_hours,
        ];
        // second query inserts product info into product table with the returned quote_id from the previous query and returns each product's id after insertion
        const productResult = await connection.query(
          productQuery,
          productValues,
        );
        const productId = productResult.rows[0].id;
        console.log(productId);

        // COST(S) POST
        const costQuery = `
      INSERT INTO "cost"
      ("product_id", "name", "value")
      VALUES
      ($1, $2, $3);
      `;
        // loops over array of costs from each product and insert into cost table
        for (const cost of product.costs) {
          const costValues = [productId, cost.name, cost.value];
          // third and final query inserts cost inputs and their corresponding values into the cost table
          await connection.query(costQuery, costValues);
        }
        // END COST(S) POST
      }
      // END PRODUCT(S) POST

      // if all posts are successful, commit those changes to the tables
      await connection.query('COMMIT;');

      res.sendStatus(201);
    } catch (err) {
      console.log('Error posting quote:', err);
      // otherwise, undo changes to tables
      await connection.query('ROLLBACK;');
      res.sendStatus(500);
    } finally {
      // Close the connection
      connection.release();
    }
  },
);
// end POST route

// PUT route to edit quote
router.put(
  '/',
  validate(z.object({ body: UpdateQuoteBody })),
  async (req, res) => {
    // Establishes a longstanding connection to our database:
    const connection = await pool.connect();

    console.log('req.body from put route: ', req.body);
    try {
      // BEGIN the SQL Transaction:
      await connection.query('BEGIN;');
      // QUOTE PUT
      // 👆 checks to make sure that quote_id and user_id both match: users may only edit their own quotes (for now)
      // first query makes updates to quote table
      await connection.query(
        /*sql*/ `
          UPDATE quote
          SET
            name = $1,
            updated_by = $2,
            manual_total_selling_price = $3,
            manual_contribution_percent = $4
          WHERE
            id = $5
            AND user_id = $2
        `,
        [
          req.body.name, // $1
          req.user?.id, // $2
          req.body.manual_total_selling_price, // $3
          req.body.manual_contribution_percent, // $4
          req.body.id, // $5
        ],
      );

      const products = req.body.products;

      // loops over array of product values to update table
      for (const product of products) {
        /** @type {import('pg').QueryConfig} */
        const productUpdate = {
          text: /*sql*/ `
            UPDATE product
            SET
            	name = $1,
            	quantity = $2,
            	selling_price_per_unit = $3,
            	total_selling_price = $4,
            	estimated_hours = $5,
            	updated_by = $6
            WHERE	id = $7
            RETURNING id
          `,
          values: [
            product.name,
            product.quantity,
            product.selling_price_per_unit,
            product.total_selling_price,
            product.estimated_hours,
            req.user?.id,
            product.id,
          ],
        };

        /** @type {import('pg').QueryConfig} */
        const productInsert = {
          text: /*sql*/ `
            INSERT INTO product (
              quote_id,
              name,
              quantity,
              selling_price_per_unit,
              total_selling_price,
              estimated_hours
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `,
          values: [
            req.body.id,
            product.name,
            product.quantity,
            product.selling_price_per_unit,
            product.total_selling_price,
            product.estimated_hours,
          ],
        };

        const productResult = await connection.query(
          product.id ? productUpdate : productInsert,
        );

        const productId = productResult.rows[0].id;

        for (const cost of product.costs) {
          /** @type {import('pg').QueryConfig} */
          const costUpdate = {
            text: /*sql*/ `
              UPDATE cost
              SET
                name = $1,
                value = $2,
                updated_by = $3
              WHERE id = $4
            `,
            values: [cost.name, cost.value, req.user?.id, cost.id],
          };

          /** @type {import('pg').QueryConfig} */
          const costInsert = {
            text: /*sql*/ `
              INSERT INTO cost (
                product_id,
                name,
                value
              )
              VALUES ($1, $2, $3)
            `,
            values: [productId, cost.name, cost.value],
          };

          await connection.query(cost.id ? costUpdate : costInsert);
        }
      }

      // if all edits are successful, commit those changes to the table
      await connection.query('COMMIT;');
      res.sendStatus(200);
    } catch (err) {
      console.log('Error editing quote: ', err);
      await connection.query('ROLLBACK;');
      res.sendStatus(500);
    } finally {
      // Close the connection
      connection.release();
    }
  },
);
// END PUT route to edit quote

// PUT route to soft-delete quote/product/cost
router.put('/remove', async (req, res) => {
  // Establishes a longstanding connection to our database:
  const connection = await pool.connect();
  console.log('req.body from soft-delete quote route: ', req.body);
  try {
    // BEGIN the SQL Transaction:
    await connection.query('BEGIN;');
    // QUOTE SOFT-DELETE
    const removeQuoteQuery = `
        UPDATE "quote"
        SET "is_removed" = $1
        WHERE "id" = $2 and "user_id" = $3;
        `;
    // 👆 checks to make sure that quote_id and user_id both match: users may only soft-delete their own quotes (for now)
    const removeQuoteValues = [
      req.body.remove_quote,
      req.body.quote_id,
      req.user?.id,
    ];
    await connection.query(removeQuoteQuery, removeQuoteValues);
    // END QUOTE SOFT_DELETE route

    // PRODUCT(S) SOFT-DELETE route
    const removeProductQuery = `
      UPDATE "product"
      SET "is_removed" = $1, "updated_by" = $3
      WHERE "id" = $2;
       `;
    const quoteProductArray = req.body.quote.products;
    console.log('quote post req.body.quote.products:', quoteProductArray);
    console.log('req.user?.id: ', req.user?.id);

    for (const product of quoteProductArray) {
      const removeProductValues = [
        req.body.remove_quote, // $1
        product.id, // $2
        req.user?.id, // $3 - gets used for both "updated_by" and WHERE "user_id" values
      ];
      await connection.query(removeProductQuery, removeProductValues);
      // COST SOFT-DELETE route
      const removeCostQuery = `
    UPDATE "product"
    SET "is_removed" = $1, "updated_by" = $3
    WHERE "id" = $2;
    `;
      for (const cost of product.costs) {
        const removeCostValues = [
          req.body.remove_quote, // $1
          cost.id, // $2
          req.user?.id, // $3
        ];
        await connection.query(removeCostQuery, removeCostValues);
      } // END COST SOFT-DELETE
    } // END PRODUCT SOFT-DELETE
    // END QUOTE SOFT-DELETE

    // if all removes are successful, commit those changes to the table
    await connection.query('COMMIT;');
    // and end connection
  } catch (err) {
    console.log('Error removing quote: ', err);
    await connection.query('ROLLBACK;');
    res.sendStatus(500);
  } finally {
    // Close the connection
    connection.release();
  }
});

// hard DELETE quote route
router.delete('/', (req, res) => {
  console.log('/api/quote/delete req.body: ', req.body);
  //   const sqlText = `
  // DELETE FROM "quote"
  //   WHERE "id" = $1 AND "user_id" = $2;
  //   `;

  //   const sqlValues = [req.body.quote_id, req.user?.id];

  //   pool
  //     .query(sqlText, sqlValues)
  //     .then(() => {
  //       res.sendStatus(200);
  //     })
  //     .catch((err) => {
  //       console.log('Error in quote.router DELETE: ', err);
  //       res.sendStatus(500);
  //     });
});

export default router;
