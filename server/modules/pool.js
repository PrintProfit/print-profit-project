import pg from 'pg';

/**
 * When our app is deployed to the internet
 * we'll use the DATABASE_URL environment variable
 * to set the connection info: web address, username/password, db name
 * eg:
 *   DATABASE_URL=postgresql://jDoe354:secretPw123@some.db.com/prime_app
 * @type {pg.PoolConfig}
 */
const dbUrlConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

/**
 * When we're running this app on our own computer
 * we'll connect to the postgres database that is
 * also running on our computer (localhost)
 * @type {pg.PoolConfig}
 */
const localConfig = {
  host: 'localhost',
  port: 5432,
  database: 'print_profit', // 	💥 Change this to the name of your database!
};

const pool = new pg.Pool(process.env.DATABASE_URL ? dbUrlConfig : localConfig);

export default pool;
