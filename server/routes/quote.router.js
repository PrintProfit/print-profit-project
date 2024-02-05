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
  		WHERE u.company_id = $1;`;
  console.log('req.params.id', req.params.id);
  const values = [req.params.id];
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
// END GET quotes route

//  POST req.body should look like:
//  {
//    user_id: 2,
//    name: 'Prime Swag',
//    manual_total_selling_price: 2000,
//    manual_contribution_percent: 40,
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
        ("user_id", "name", "manual_total_selling_price", "manual_contribution_percent")
        VALUES
        ($1, $2, $3, $4)
        RETURNING "id";
     `;
    const quoteValues = [
      req.user.id,
      req.body.name,
      req.body.manual_total_selling_price,
      req.body.manual_contribution_percent,
    ];
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
      const productResult = await connection.query(productQuery, productValues);
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
    connection.query('COMMIT;');
    // and end connection
    connection.release();

    res.sendStatus(201);
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
      SET "name" = $1, "updated_by" = $2, "manual_total_selling_price" = $3, "manual_contribution_percent" = $4
      WHERE "id" = $5 and "user_id" = $2;
    `;
    // 👆 checks to make sure that quote_id and user_id both match: users may only edit their own quotes (for now)
    const editQuoteValues = [
      req.body.name, // $1
      req.user.id, // $2
      req.body.manual_total_selling_price, // $3
      req.body.manual_contribution_percent, // $4
      req.body.id, // $5
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
    for (const product of quoteProductArray) {
      const editProductValues = [
        product.name, //$1
        product.quantity, //$2
        product.selling_price_per_unit, //$3
        product.total_selling_price, //$4
        product.estimated_hours, //$5
        req.user.id, // $6 - user id gets inserted into the "updated_by" column
        // we re-use req.user.id for the sql query's "WHERE" clause => users may ONLY edit quotes that they themselves created
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
      for (const cost of product.costs) {
        const editCostValues = [
          cost.name, // $1
          cost.value, // $2
          cost.id, // $3
          req.user.id,
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
      req.user.id,
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

    for (const product of quoteProductArray) {
      const removeProductValues = [
        product.remove_product, // $1
        product.id, // $2
        req.user.id, // $3 - gets used for both "updated_by" and WHERE "user_id" values
      ];
      await connection.query(removeProductQuery, removeProductValues);
      // COST SOFT-DELETE route
      const removeCostQuery = `
    UPDATE "product"
    SET "is_removed" = $1, "updated_by" = $3
    WHERE "id" = $2 and "user_id" = $3;
    `;
      for (const cost of product.costs) {
        const removeCostValues = [
          cost.remove_cost, // $1
          cost.id, // $2
          req.user.id,
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

// quoteArray = [
//   // first quote
//   {
//   id: 1,
//   name: 'Prime Swag',
//   created_by: 1,
//   manual_total_selling_price: 2000,
//   manual_contribution_percent: 4,
//   products: [
//     // first product
//     {
//       id: 1,
//       name: 'T-shirts',
//       quantity: 100,
//       selling_price_per_unit: 15,
//       total_selling_price: 1500,
//       estimated_hours: 6,
//       costs: [
//         // first cost input
//         {
//           id: 1,
//           name: 'Garment',
//           value: 400,
//         },
//         // second cost input
//         {
//           id: 2,
//           name: 'Ink',
//           value: 200,
//         },
//       ],
//     },
//     // second product
//     {
//       id: 2,
//       name: 'Hoodies',
//       quantity: 50,
//       selling_price_per_unit: 30,
//       total_selling_price: 1500,
//       estimated_hours: 4,
//       costs: [
//         // first cost input
//         {
//           id: 3,
//           name: 'Garment',
//           value: 750,
//         },
//         // second cost input
//         {
//           id: 4,
//           name: 'Ink',
//           value: 100,
//         },
//       ],
//     },
//   ],
// }];

module.exports = router;
