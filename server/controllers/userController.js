const pool = require("../config/pg");
const Cart = require("../models/CartModel");

exports.topUp = async (req, res) => {
  const user_id = req.user.id;
  const topup_amount = req.body.top_up;
  try {
    const balanceResult = await pool.query(
      "SELECT balance FROM users WHERE user_id = $1",
      [user_id]
    );
    const currentBalance = balanceResult.rows[0].balance;
    const newBalance = Number(currentBalance) + Number(topup_amount);
    await pool.query(
      `UPDATE users SET balance = $1 WHERE user_id = $2`,
      [newBalance, user_id]
    );
    res.status(200).json({ message: "Top up success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const user_id = req.user.id;
  try {
    let cart = await Cart.findOne({ user_id: user_id });
    if(!cart) {
      cart = new Cart({ user_id: user_id, items: [] });
      cart.save();
    } 
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.postCart = async (req, res) => {
  const user_id = req.user.id;
  const product = req.body;
  try {
    let cart = await Cart.findOne({ user_id: user_id });
    if (!cart) {
      cart = new Cart({ user_id: user_id, items: [] });
      cart.save();
    }

    await cart.addToCart(product)
    res.status(200).json(cart);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

exports.postCartDeleteProduct = async (req, res) => {
  const user_id = req.user.id;
  const product = req.body;
  try {
    let cart = await Cart.findOne({ user_id: user_id });
    if (!cart) {
      cart = new Cart({ user_id: user_id, items: [] });
      cart.save();
    }
    await cart.removeFromCart(product);
    res.status(200).json(cart);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

