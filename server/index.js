const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/pg");
const connectDatabase = require("./config/mongodb");

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

connectDatabase();
pool.connect().then(() => {
  console.log("Connected to PostgreSQL.");
});

app.listen(PORT, () => {
  console.log(`Server running on port`, PORT);
});
