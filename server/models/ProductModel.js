const mongoose = require("mongoose");

const foodTypes = ['fruits', 'vegetables', 'grains', 'bread', 'pasta', 'meat', 'seafood', 'eggs', 'dairy', 'nuts', 'fermented', 'oils', 'other'];

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  expired: {
    type: Date,
    required: false
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: foodTypes,
    required: true
  },
  avg_rating: {
    type: Number,
    default: 0
  },
  seller_id: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model("Product", ProductSchema);