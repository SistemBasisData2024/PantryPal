const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/pg");
const connectDatabase = require("./config/mongodb");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes  = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reviewRoutes = require("./routes/reviewRoutes")

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/foods", foodRoutes);
app.use("/reviews", reviewRoutes);

connectDatabase();
pool.connect().then(() => {
  console.log("Connected to PostgreSQL.");
});

app.listen(PORT, () => {
  console.log(`Server running on port`, PORT);
});