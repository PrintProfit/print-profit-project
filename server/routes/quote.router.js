const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// GET all quotes
router.get('/', (req, res) => {
  const query = `
  SELECT q.name as "quote_name", q.user_id, q.inserted_at as "quote_inserted_at", q.updated_at as "quote_updated_at", q.updated_by as "quote.updated_by", p.name as "product_name", p.quantity as "product_quantity", p.selling_price_per_unit as "product_selling_price_per_unit", p.total_selling_price, p.estimated_hours, c.name as "cost_input_name", c.value
  FROM "quote" q
  INNER JOIN "user" on q.user_id = "user".id
  INNER JOIN "product" AS p ON q.id = p.quote_id
  INNER JOIN "cost" AS c ON p.id = c.product_id
  WHERE "user".company_id = $1
  ;`;
  console.log('req.params from quote get router', req.params.id);
  const values = [req.params.id];
  pool
    .query(query, values)
    .then((dbRes) => {
      const quotesArray = dbRes.rows;
      res.send(quotesArray);
    })
    .catch((dbErr) => {
      res.sendStatus(500);
    });
});
// END GET quotes route

//  POST req.body should look like:
//  {
//    user_id: 2,
//    name: 'Prime Swag',
//    quote: [
//      // 👇 FIRST ORDER (PRODUCT) IN QUOTE
//              {
//                name: 't-shirts',
//                quantity: 80,
//                selling_price: 14.99,
//                total_selling_price: 1199.20,
//                estimated_hours: 4,
//                costs: [
//      // 👇 FIRST COST INPUT IN PRODUCT 1
//                  {
//                    name: 'garment',
//                    value: 480
//                    },
//                    // END FIRST COST INPUT
//      // 👇 SECOND COST INPUT IN PRODUCT 1
//                  {
//                    name: 'ink',
//                    value: 200
//                    }
//                    // END SECOND COST INPUT
//                 ]
//                 // END OF COST INPUTS IN PRODUCT 1
//                },
//               // END OF FIRST PRODUCT
//       // 👇 SECOND PRODUCT IN QUOTE
//              {
//                name: 'hoodies',
//                quantity: 50,
//                selling_price: 39.99,
//                total_selling_price: 1999.50,
//                estimated_hours: 6,
//                costs: [
//                   {
//                    name: 'garment',
//                    value: 900
//                    },
//                  {
//                    name: 'ink',
//                    value: 150
//                    }
//                        ]
//                        // END OF COST INPUTS
//                }
//               // END OF SECOND PRODUCT

//            ]
//           // END OF PRODUCTS ARRAY
// }

// POST new quote

// PUT quote req.body will look the same, but each object (quote, product, and cost) will additionally have an id

// POST quotes route
router.post('/', async (req, res) => {
  let connection;

  try {
    console.log('quote post req.body:', req.body);

    // Establishes a longstanding connection to our database:
    connection = await pool.connect();

    // BEGIN the SQL Transaction:
    await connection.query('BEGIN;');

    // first query inserts quote name and user_id into quote table ==> 🔥 need to get user_id from user state
    // QUOTE POST
    const quoteQuery = `
      INSERT INTO "quote"
        ("user_id", "name")
        VALUES
        ($1, $2)
        RETURNING "id";
     `;
    const quoteValues = [req.body.user_id, req.body.name];
    // query returns id from the inserted quote
    const returnedQuoteIdRows = await connection.query(quoteQuery, quoteValues);
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

    const quoteProductArray = req.body.quote;
    console.log('quote post req.body.quote:', quoteProductArray);

    // loops over array of products belonging to the posted quote
    for (product of quoteProductArray) {
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
      const productId = await connection.query(productQuery, productValues);
      console.log(productId);

      // COST(S) POST
      const costQuery = `
      INSERT INTO "cost"
      ("product_id", "name", "value")
      VALUES
      ($1, $2, $3);
      `;
      // loops over array of costs from each product and insert into cost table
      for (cost of product.costs) {
        const costValues = [productId, cost.name, cost.value];
        // third and final query inserts cost inputs and their corresponding values into the cost table
        await connection.query(costQuery, costValues);
      }
      // END COST(S) POST
    }
    // END PRODUCT(S) POST

    // if all posts are successful, commit those changes to the tables
    connection.query('COMMIT;');
    // and end connection
    connection.release();
  } catch (err) {
    console.log('Error posting quote:', err);
    // otherwise, undo changes to tables
    connection.query('ROLLBACK;');
    connection.release();
    res.sendStatus(500);
  }
});
// end POST route

// PUT route to edit quote
router.put('/', async (req, res) => {
  let connection;
  console.log('req.body from put route: ', req.body);
  try {
    // Establishes a longstanding connection to our database:
    connection = await pool.connect();

    // BEGIN the SQL Transaction:
    await connection.query('BEGIN;');

    const editQuoteQuery = `
    UPDATE "quote"
      SET "name" = $1
      WHERE "id" = $2 and "user_id" = $3;
    `;
    const editQuoteValues = [
      req.body.name,
      req.body.quote_id,
      req.body.user_id,
    ];
    await connection.query(editQuoteQuery, editQuoteValues);

    const editProductQuery = `
    UPDATE "product"
      SET "name" = $1, "quantity" = $2, "selling_price_per_unit" = $3, "total_selling_price" = $4, "estimated_hours" = $5
      WHERE "id" = $3 and "user_id" = $3;
    `;

    const quoteProductArray = req.body.quote;
    console.log('quote post req.body.quote:', quoteProductArray);
  } catch (err) {
    console.log('Error editing quote: ', err);
    connection.query('ROLLBACK;');
    connection.release();
    res.sendStatus(500);
  }
});
// END PUT route to edit quote

module.exports = router;
