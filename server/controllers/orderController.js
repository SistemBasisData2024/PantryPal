const pool = require("../config/pg");
const Cart = require("../models/CartModel");
const payment_status = require("../utils/payment_status");
const order_status = require("../utils/order_status");

exports.getOrders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const orders = await pool.query(
      'SELECT * FROM "Order" WHERE user_id = $1',
      [user_id]
    );
    res.status(200).json({ payload: orders.rows });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await pool.query('SELECT * FROM "Order" WHERE order_id = $1', [orderId]);
    res.status(200).json(order);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.getSupplierOrders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const orders = await pool.query(
      "SELECT * FROM orderitem WHERE seller_id = $1",
      [user_id]
    );
    res.status(200).json(orders.rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getOrderDetails = async (req, res) => {
  const order_id = req.params.orderId;
  try {
    const orders = await pool.query(
      "SELECT * FROM orderitem WHERE order_id = $1",
      [order_id]
    );
    res.status(200).json(orders.rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getPayments = async (req, res) => {
  const user_id = req.user.id;
  try {
    const payments = await pool.query(
      "SELECT * FROM payment WHERE user_id = $1",
      [user_id]
    );
    res.status(200).json({ payload: payments });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getOrderAddress = async (req, res) => {
  const order_id = req.params.orderId;
  try {
    const orderAddress = await pool.query(
      "SELECT * FROM orderaddress WHERE order_id = $1",
      [order_id]
    );
    if (orderAddress.rows.length === 0) {
      return res.status(404).json({ error: "Order address not found" });
    }
    res.status(200).json(orderAddress.rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.makeOrder = async (req, res) => {
  const user_id = req.user.id;
  const { products, method, total_amount, country, city, street } = req.body;
  if (products.length === 0 || !Array.isArray(products)) {
    return res.status(400).json({ msg: "No products provided" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const current_timestamp = await client.query("SELECT NOW()");
    const timestamp = current_timestamp.rows[0].now;

    // Order
    const order = await client.query(
      'INSERT INTO "Order" (order_date, status, user_id) VALUES ($1, $2, $3) RETURNING order_id',
      [timestamp, payment_status.awaiting_payment, user_id]
    );
    const order_id = order.rows[0].order_id;

    // OrderItem
    for (const product of products) {
      const { product_id, seller_id, quantity } = product;
      await client.query(
        "INSERT INTO orderitem (order_id, product_id, seller_id, quantity) VALUES ($1, $2, $3, $4)",
        [order_id, product_id, seller_id, quantity]
      );
    }

    // OrderAddress
    await client.query(
      "INSERT INTO orderaddress (order_id, country, city, street) VALUES ($1, $2, $3, $4)",
      [order_id, country, city, street]
    );

    // Payment
    const payment = await client.query(
      "INSERT INTO payment (user_id, order_id, method, payment_status, total_amount) VALUES ($1, $2, $3, $4, $5)",
      [user_id, order_id, method, payment_status.awaiting_payment, total_amount]
    );

    await client.query("COMMIT");

    // clear cart (MongoDB)
    let cart = await Cart.findOne({ user_id: user_id });
    if (!cart) {
      cart = new Cart({ user_id: user_id, items: [] });
      cart.save();
    }
    await cart.clearCart();

    res.status(201).json({ msg: "Order success", order_id: order_id });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ msg: "Order failed", error: error.message });
  } finally {
    client.release();
  }
};

exports.cancelOrder = async (req, res) => {
  const user_id = req.user.id;
  const role = req.user.role;
  const order_id = req.params.orderId;
  try {
    // ownership checker
    if (role === "user") {
      const orderOwnership_user = await pool.query(
        'SELECT * FROM "Order" WHERE user_id = $1 AND order_id = $2',
        [user_id, order_id]
      );
      if (orderOwnership_user.rows.length === 0) {
        return res.status(403).json({ error: "Access denied" });
      }
    } else {
      const orderOwnership_supplier = await pool.query(
        "SELECT * FROM orderitem WHERE seller_id = $1 AND order_id = $2",
        [user_id, order_id]
      );
      if (orderOwnership_supplier.rows.length === 0) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const orderStatus = await pool.query(
      `SELECT status FROM "Order" WHERE order_id = $1`,
      [order_id]
    );
    if (orderStatus.rows[0].status === order_status.pending) {
      // add balance if order has been payed
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
      const newBalance = currentBalance + totalAmount;
      await pool.query("UPDATE users SET balance = $1 WHERE user_id = $2", [
        newBalance,
        user_id,
      ]);
    }

    const order = await pool.query(
      `UPDATE "Order" SET status = $1 WHERE order_id = $2 RETURNING *`,
      [order_status.cancelled, order_id]
    );
    await pool.query(
      `UPDATE payment SET payment_status = $1 WHERE order_id = $2 RETURNING *`,
      [payment_status.failed, order_id]
    );

    await pool.query(`DELETE FROM orderitem WHERE order_id = $1`, [order_id]);
    await pool.query(`DELETE FROM orderaddress WHERE order_id = $1`, [
      order_id,
    ]);
    res
      .status(200)
      .json({ message: "Order cancelled succesfully", payload: order.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.acceptOrder = async (req, res) => {
  const user_id = req.user.id;
  const order_id = req.params.orderId;
  try {
    const orderOwnership_supplier = await pool.query(
      "SELECT * FROM orderitem WHERE seller_id = $1 AND order_id = $2",
      [user_id, order_id]
    );
    if (orderOwnership_supplier.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Order with the corresponding seller does not exist" });
    }

    const orderStatus = await pool.query(
      `SELECT status FROM "Order" WHERE order_id = $1`,
      [order_id]
    );
    if (orderStatus.rows[0].status !== order_status.pending) {
      return res.status(400).json({ error: "Order has not been paid" });
    }
    await pool.query(
      'UPDATE "Order" SET status = $1 WHERE order_id = $2 RETURNING *',
      [order_status.processing, order_id]
    );
    res.status(200).json({ message: "Order Accepted succesfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deliverOrder = async (req, res) => {
  const order_id = req.params.orderId;
  const user_id = req.user.id;
  try {
    const orderOwnership_supplier = await pool.query(
      "SELECT * FROM orderitem WHERE seller_id = $1 AND order_id = $2",
      [user_id, order_id]
    );
    if (orderOwnership_supplier.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }
    const orderStatus = await pool.query(
      `SELECT status FROM "Order" WHERE order_id = $1`,
      [order_id]
    );
    if (orderStatus.rows[0].status !== order_status.processing) {
      return res.status(400).json({ error: "Order has not been accepted" });
    }
    const order = await pool.query(
      'UPDATE "Order" SET status = $1 WHERE order_id = $2',
      [order_status.delivered, order_id]
    );
    res.status(200).json({ message: "Order delivered", payload: order });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.completeOrder = async (req, res) => {
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
    if (orderOwnership_user.rows[0].status !== order_status.delivered) {
      return res.status(400).json({ error: "Order has not been delivered" });
    }

    // search corresponding seller
    const seller = await pool.query(
      "SELECT * FROM orderitem WHERE order_id = $1",
      [order_id]
    );
    const seller_id = seller.rows[0].seller_id;
    console.log("seller_id:", seller_id);

    // balance transaction
    const costResult = await pool.query(
      "SELECT total_amount FROM payment WHERE order_id = $1",
      [order_id]
    );
    const totalAmount = costResult.rows[0].total_amount;
    console.log("price: ", totalAmount);
    const balanceResult = await pool.query(
      "SELECT balance FROM users WHERE user_id = $1",
      [seller_id]
    );
    const currentBalance = balanceResult.rows[0].balance;
    console.log("curr: ", currentBalance);
    const newBalance = Number(currentBalance) + Number(totalAmount);
    console.log("new: ", newBalance);
    await pool.query("UPDATE users SET balance = $1 WHERE user_id = $2", [
      newBalance,
      seller_id,
    ]);

    const order = await pool.query(
      'UPDATE "Order" SET status = $1 WHERE order_id = $2 RETURNING *',
      [order_status.completed, order_id]
    );

    res
      .status(200)
      .json({ message: "Order completed", payload: order.rows[0] });
  } catch (error) {
    console.error(`Error completing order: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

exports.payOrder = async (req, res) => {
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
    if (newBalance < 0) {
      res.status(400).json({ message: "Not enough balance" });
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

    res
      .status(200)
      .json({ message: "Order paid successfully", payload: order });
  } catch (error) {
    console.error(`Error paying for order: ${error}`);
    res.status(500).json({ error: error.message });
  }
};
