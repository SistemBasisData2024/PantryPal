const pool = require("../config/pg");
const Product = require("../models/ProductModel");

const getAllProducts = async (req, res, next) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res, next) => {
  try {
    console.log("seller id: ", req.user.id);
    const seller_id = req.user.id;
    const product = await Product.find({ seller_id: seller_id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      error.message = "Product not found";
      throw error;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res, next) => {
  const { name, description, price, type } = req.body;
  try {
    const user_id = req.user.id;
    const product = new Product({
      name: name,
      description: description,
      price: price,
      type: type,
      seller_id: user_id,
    });
    const insertProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product added successfully", payload: insertProduct });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

// const updateProduct = async (req, res, next) => {
//   const id = req.params.productId;
//   const newData = req.body;
//   try {
//     const product = await Product.updateOne({ _id: id }, { $set: newData });
//     res
//       .status(200)
//       .json({ message: "Product updated successfully", payload: product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteProduct = async (req, res, next) => {
//   const id = req.params.productId;
//   try {
//     const product = await Product.deleteOne({ _id: id });
//     res
//       .status(200)
//       .json({ message: "Product deleted successfully", payload: product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const addProduct = async (req, res) => {
//   const { email, name, description, price } = req.body;

//   try {
//     const seller_id = req.user.id;
//     const result = await pool.query(
//       'INSERT INTO products (name, description, price, seller_id) VALUES ($1, $2, $3, $4) RETURNING *',
//       [name, description, price, seller_id]
//     );
//     res.status(201).json({msg: "Success", payload: result.rows[0]});
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getProducts = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products');
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = { getProducts, getAllProducts, getProductById, addProduct };
