const pool = require("../config/pg");
const payment_status = require("../utils/payment_status");
const order_status = require("../utils/order_status");

const payOrder = async (req, res) => {
  const order_id = req.params.orderId;
  const user_id = req.user.id;
  try {
    const orderOwnership_user = await pool.query(
      'SELECT * FROM "Order" WHERE user_id = $1 AND order_id = $2',
      [user_id, order_id]
    );
    if (orderOwnership_user.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    // balance transaction
    const costResult = await pool.query(
      "SELECT total_amount FROM payment WHERE order_id = $1",
      [order_id]
    );
    const totalAmount = costResult.rows[0].total_amount;
    const balanceResult = await pool.query(
      "SELECT balance FROM users WHERE user_id = $1",
      [user_id]
    );
    const currentBalance = balanceResult.rows[0].balance;
    const newBalance = Number(currentBalance) - Number(totalAmount);
    if(newBalance < 0) {
      res.status(400).json({ message: "Not enough balance" })
    }
    await pool.query("UPDATE users SET balance = $1 WHERE user_id = $2", [
      newBalance,
      user_id,
    ]);
    await pool.query(
      `UPDATE payment SET payment_status = $1 WHERE order_id = $2`,
      [payment_status.success, order_id]
    );
    const order = await pool.query(
      'UPDATE "Order" SET status = $1 WHERE order_id = $2 RETURNING *',
      [order_status.pending, order_id]
    );

    res.status(200).json({ message: "Order paid successfully", payload: order });
  } catch (error) {
    console.error(`Error paying for order: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { payOrder };