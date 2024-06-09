const pool = require("../config/pg");
const Review = require("../models/ReviewModel");
const Recipe = require("../models/RecipeModel");

const updateRating = async (entityId, entityType, rating) => {
  const reviews = await Review.find({ entityId: entityId });

  let updatedRating;
  
  if (entityType === "recipe") {
    const recipe = await Recipe.findOne({ _id: entityId });
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    updatedRating = (totalRatings + rating) / (reviews.length + 1);
    await recipe.updateRecipeRating(updatedRating, reviews.length + 1);
  } else {
    let reviewAmount = reviews.length + 1;
    const product_id = Number(entityId);
    const product = await pool.query(
      `SELECT avg_rating FROM product WHERE product_id = $1`,
      [product_id]
    );
    const current_rating = product.rows[0]?.avg_rating || 0;
    updatedRating = ((Number(current_rating) * (reviewAmount - 1)) + Number(rating)) / reviewAmount;

    await pool.query(
      "UPDATE product SET avg_rating = $1 WHERE product_id = $2 RETURNING *",
      [updatedRating, product_id]
    );
  }

  return updatedRating;
};

exports.getReview = async (req, res) => {
  const entity_id = req.params.entityId;
  try {
    const reviews = await Review.find({ entityId: entity_id });
    if(reviews.length === 0) {
      return res.status(404).json({ message: "No reviews added" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const user_id = req.user.id;
  const { entityType, entityId, comment, rating } = req.body;
  try {
    const newReview = new Review({
      entityType: entityType,
      entityId: entityId,
      user_id: user_id,
      comment: comment,
      rating: rating,
    });
    await newReview.save();
    const updatedRating = await updateRating(entityId, entityType, rating);
    res.status(200).json({
      review: newReview,
      updatedRating: updatedRating,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
