const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// GET all quotes
router.get('/:id', (req, res) => {
  const query = `
  SELECT q.id as "quote_id", q.name as "quote_name", q.user_id, q.inserted_at as "quote_inserted_at", q.updated_at as "quote_updated_at", q.updated_by as "quote.updated_by", p.id as "product_id", p.name as "product_name", p.quantity as "product_quantity", p.selling_price_per_unit as "product_selling_price_per_unit", p.total_selling_price, p.estimated_hours, c.id as "cost_id", c.name as "cost_input_name", c.value
  FROM "quote" q
  INNER JOIN "user" on q.user_id = "user".id
  INNER JOIN "product" AS p ON q.id = p.quote_id
  INNER JOIN "cost" AS c ON p.id = c.product_id
  WHERE "user".company_id = $1
  ORDER BY "product_id", "cost_id";`;
  console.log('req.params.id', req.params.id);
  const values = [req.params.id];
  pool
    .query(query, values)
    .then((dbRes) => {
      const formattedQuote = formatQuotesObject(dbRes.rows);
      res.send(formattedQuote);
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
    // QUOTE PUT
    const editQuoteQuery = `
    UPDATE "quote"
      SET "name" = $1, "updated_by" = $3
      WHERE "id" = $2 and "user_id" = $3;
    `;
    // 👆 checks to make sure that quote_id and user_id both match: users may only edit their own quotes (for now)
    const editQuoteValues = [
      req.body.name, // $1
      req.body.quote_id, // $2
      req.body.user_id, // $3
    ];
    // first query makes updates to quote table
    await connection.query(editQuoteQuery, editQuoteValues);
    // END QUOTE PUT route

    // PRODUCT(S) PUT route
    const editProductQuery = `
      UPDATE "product"
        SET "name" = $1, "quantity" = $2, "selling_price_per_unit" = $3, "total_selling_price" = $4, "estimated_hours" = $5, updated_by = $6
        WHERE "id" = $7 and "user_id" = $6;
    `;
    const quoteProductArray = req.body.quote;
    console.log('quote post req.body.quote:', quoteProductArray);

    // loops over array of product values to update table
    for (product of quoteProductArray) {
      const editProductValues = [
        product.name, //$1
        product.quantity, //$2
        product.selling_price_per_unit, //$3
        product.total_selling_price, //$4
        product.estimated_hours, //$5
        req.body.user_id, // $6 - user id gets inserted into the "updated_by" column
        // we re-use req.body.user_id for the sql query's "WHERE" clause => users may ONLY edit quotes that they themselves created
        product.id, // $7
      ];
      // actual query to update the product tables
      await connection.query(editProductQuery, editProductValues);
      // COST(S) PUT route
      const editCostQuery = `
        UPDATE "cost"
          SET "name" = $1, "value" = $2, "updated_by" = $4
          WHERE "id" = $3 AND "user_id" = $4;
     `;
      // nested loop goes over each cost in the given product and updates the corresponding values in the cost table
      for (cost of product.costs) {
        const editCostValues = [
          cost.name, // $1
          cost.value, // $2
          cost.id, // $3
          req.body.user_id,
        ]; // $4
        await connection.query(editCostQuery, editCostValues);
      } // END COST(S) PUT
    } // END PRODUCT(S) PUT
    // END QUOTE PUT

    // if all edits are successful, commit those changes to the table
    connection.query('COMMIT;');
    // and end connection
    connection.release();
  } catch (err) {
    console.log('Error editing quote: ', err);
    connection.query('ROLLBACK;');
    connection.release();
    res.sendStatus(500);
  }
});
// END PUT route to edit quote

// PUT route to soft-delete quote/product/cost
router.put('/remove', async (req, res) => {
  let connection;
  console.log('req.body from soft-delete quote route: ', req.body);
  try {
    // Establishes a longstanding connection to our database:
    connection = await pool.connect();

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
      req.body.user_id,
    ];
    await connection.query(removeQuoteQuery, removeQuoteValues);
    // END QUOTE SOFT_DELETE route

    // PRODUCT(S) SOFT-DELETE route
    const removeProductQuery = `
      UPDATE "product"
      SET "is_removed" = $1, "updated_by" = $3
      WHERE "id" = $2 and "user_id" = $3;
       `;
    const quoteProductArray = req.body.quote;
    console.log('quote post req.body.quote:', quoteProductArray);

    for (product of quoteProductArray) {
      const removeProductValues = [
        product.remove_product, // $1
        product.id, // $2
        req.body.user_id, // $3 - gets used for both "updated_by" and WHERE "user_id" values
      ];
      await connection.query(removeProductQuery, removeProductValues);
      // COST SOFT-DELETE route
      const removeCostQuery = `
    UPDATE "product"
    SET "is_removed" = $1, "updated_by" = $3
    WHERE "id" = $2 and "user_id" = $3;
    `;
      for (cost of product.costs) {
        const removeCostValues = [
          cost.remove_cost, // $1
          cost.id, // $2
          req.body.user_id,
        ]; // $3
        await connection.query(removeCostQuery, removeCostValues);
      } // END COST SOFT-DELETE
    } // END PRODUCT SOFT-DELETE
    // END QUOTE SOFT-DELETE

    // if all removes are successful, commit those changes to the table
    connection.query('COMMIT;');
    // and end connection
    connection.release();
  } catch (err) {
    console.log('Error removing quote: ', err);
    connection.query('ROLLBACK;');
    connection.release();
    res.sendStatus(500);
  }
});

quote = {
  id: 1,
  name: 'Prime Swag',
  created_by: 1,
  products: [
    // first product
    {
      id: 1,
      name: 'T-shirts',
      quantity: 100,
      selling_price_per_unit: 15,
      total_selling_price: 1500,
      estimated_hours: 6,
      costs: [
        // first cost input
        {
          id: 1,
          name: 'Garment',
          value: 400,
        },
        // second cost input
        {
          id: 2,
          name: 'Ink',
          value: 200,
        },
      ],
    },
    // second product
    {
      id: 2,
      name: 'Hoodies',
      quantity: 50,
      selling_price_per_unit: 30,
      total_selling_price: 1500,
      estimated_hours: 4,
      costs: [
        // first cost input
        {
          id: 3,
          name: 'Garment',
          value: 750,
        },
        // second cost input
        {
          id: 4,
          name: 'Ink',
          value: 100,
        },
      ],
    },
  ],
};

function formatQuotesObject(quoteRows) {
  // need to account for MULTIPLE quotes==> array
  const quote = {};

  quote.id = quoteRows[0].quote_id;
  quote.name = quoteRows[0].name;
  quote.created_by = quoteRows[0].user_id;
  quote.products = [];

  for (const product of quote.products) {
    quote.products.push({
      id: product.product_id,
      name: product.product_name,
      quantity: product.product_quantity,
      selling_price_per_unit: product.product_selling_price_per_unit,
      total_selling_price: product.total_selling_price,
      estimated_hours: product.estimated_hours,
      costs: [],
    });
    for (const cost of product) {
      costs.push({
        id: cost.cost_id,
        name: cost.cost_input_name,
        value: cost.value,
      });
    }
  }
  return quote;
}

module.exports = router;
