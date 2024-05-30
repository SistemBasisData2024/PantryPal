const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  items: [{
    product_id: {
      type: Number,
      required: true
    },
    seller_id: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required:true,
      default: 0
    }
  }]
});

CartSchema.methods.addToCart = async function(product) {
  const cartProductIndex = this.items.findIndex(item => {
    return item.product_id.toString() === product.product_id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      product_id: product.product_id,
      seller_id: product.seller_id,
      quantity: newQuantity
    });
  }

  this.items = updatedCartItems;
  return this.save();
};

CartSchema.methods.removeFromCart = function(product) {
  const updatedCartItems = this.items.filter(item => {
    return item.product_id.toString() !== product.product_id.toString();
  });
  this.items = updatedCartItems;
  return this.save();
};

CartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model("Cart", CartSchema);