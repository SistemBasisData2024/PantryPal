const mongoose = require("mongoose");

const entityType = ['recipe', 'product'];

const ReviewSchema = mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  entityType: {
    type: String,
    enum: entityType,
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);