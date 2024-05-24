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

const updateProduct = async (req, res, next) => {
  const id = req.params.productId;
  const data = req.body;
  const seller_id = req.user.id;
  try {
    const product = await Product.findOne({ _id: id });
    
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    if(product.seller_id != seller_id) {
      return res.status(403).json({ msg: "Forbidden request"});
    }
    const updatedProduct = await Product.updateOne({ _id: id }, { $set: data });
    res
      .status(200)
      .json({ message: "Product updated successfully", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  const product_id = req.params.productId;
  const seller_id = req.user.id;
  try {
    const product = await Product.findOne({ _id: product_id });
    
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    if(product.seller_id != seller_id) {
      return res.status(403).json({ msg: "Forbidden request"});
    }
    
    const deletedProduct = await Product.deleteOne({ _id: product_id });
    res
      .status(200)
      .json({ message: "Product deleted successfully", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };
