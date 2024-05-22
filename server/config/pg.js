const { Pool } = require("pg");
require('dotenv').config(); 

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
  ssl: require
});

module.exports = pool;