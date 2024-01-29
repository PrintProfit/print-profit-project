const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

router.get('/', (req, res) => {
  // GET all quotes
  const query = `
  SELECT q.name as "quote_name", q.user_id, q.inserted_at as "quote_inserted_at", q.updated_at as "quote_updated_at", q.updated_by as "quote.updated_by", p.name as "product_name", p.quantity as "product_quantity", p.selling_price_per_unit as "product_selling_price_per_unit", p.total_selling_price, p.estimated_hours, c.name as "cost_input_name", c.value
  FROM "quote" q
  INNER JOIN "user" on q.user_id = "user".id
  INNER JOIN "product" AS p ON q.id = p.quote_id
  INNER JOIN "cost" AS c ON p.id = c.product_id
  WHERE "user".company_id = $1
  ;`;
});

module.exports = router;
