const mongoose = require("mongoose");
const cuisine = require("../utils/cuisine");

const FoodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  cuisine: {
    type: String,
    enum: cuisine,
    required: true
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }]
})

module.exports = mongoose.model("Food", FoodSchema);