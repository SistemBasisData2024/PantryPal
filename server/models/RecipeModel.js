const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema({
  food: {
    type: mongoose.Types.ObjectId,
    ref: "Food",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avg_rating: {
    type: Number,
    default: 0
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }]
});

RecipeSchema.methods.updateRecipeRating = function(rating, totalReviews) {
  let newRating = ((this.avg_rating * (totalReviews - 1)) + rating) / totalReviews;
  this.avg_rating = newRating;
  return this.save();
}

module.exports = mongoose.model("Recipe", RecipeSchema);