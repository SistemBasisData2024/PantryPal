const pool = require("../config/pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

const createToken = (user_id, role) => {
  return jwt.sign({ id: user_id, role: role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    if (!name || !email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("invalid email");
    }
    const exists = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if(exists.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use"});
    }
    const result = await pool.query(
      "INSERT INTO users (name, email, password, balance, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, 0, role]
    );
    res
      .status(201)
      .json({ message: "Register successfull", payload: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "All fields must be filled" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = createToken(user.user_id, user.role);
    res.json({ payload: user, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
