const pool = require("../config/pg");
const Review = require("../models/ReviewModel");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const { rows: products } = await pool.query("SELECT * FROM product");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProducts: async (req, res) => {
    const user_id = req.user.id;
    try {
      const product = await pool.query(
        "SELECT * FROM product WHERE seller_id = $1",
        [user_id]
      );
      res.status(200).json(product.rows);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  getProductById: async (req, res) => {
    const product_id = req.params.productId;
    try {
      const product = await pool.query(
        "SELECT * FROM product WHERE product_id = $1",
        [product_id]
      );
      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ payload: product.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  addProduct: async (req, res) => {
    const newProduct = req.body;
    const user_id = req.user.id;
    try {
      const product = await pool.query(
        "INSERT INTO product (name, description, brand, expired, stock, price, type, avg_rating, seller_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          newProduct.name,
          newProduct.description,
          newProduct.brand,
          newProduct.expired,
          newProduct.stock,
          newProduct.price,
          newProduct.type,
          newProduct.avg_rating,
          user_id,
          newProduct.image,
        ]
      );
      const result = product.rows[0];
      res
        .status(201)
        .json({ message: "Product added successfully!", payload: result });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    const product_id = req.params.productId;
    const data = req.body;
    const seller_id = req.user.id;
    try {
      const product = await pool.query(
        "SELECT * FROM product WHERE product_id = $1",
        [product_id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.rows[0].seller_id != seller_id) {
        return res.status(403).json({ msg: "Forbidden request" });
      }
      const updatedProduct = await pool.query(
        `
            UPDATE product
            SET 
                name = $1,
                description = $2,
                brand = $3, 
                expired = $4, 
                stock = $5, 
                price = $6, 
                type = $7, 
                avg_rating = $8,
                image = $9
            WHERE 
                product_id = $10
            RETURNING *
        `,
        [
          data.name,
          data.description,
          data.brand,
          data.expired,
          data.stock,
          data.price,
          data.type,
          data.avg_rating,
          data.image,
          product_id,
        ]
      );

      await Review.findByIdAndDelete({ entityId: product_id });

      res.status(200).json({
        message: "Product updated successfully",
        payload: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const product_id = req.params.productId;
    const seller_id = req.user.id;
    try {
      const product = await pool.query(
        "SELECT * FROM product WHERE product_id = $1",
        [product_id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.rows[0].seller_id !== seller_id) {
        return res.status(403).json({ msg: "Forbidden request" });
      }

      const deletedProduct = await pool.query(
        "DELETE FROM product WHERE product_id = $1",
        [product_id]
      );
      res.status(200).json({
        message: "Product deleted successfully",
        payload: deletedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productController;
