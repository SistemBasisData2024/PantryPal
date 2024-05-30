const pool = require("../config/pg");
const Review = require("../models/ReviewModel");
const Recipe = require("../models/RecipeModel");

const updateRating = async (entityId, entityType, rating) => {
  console.log("entityId: ", entityId);
  const reviews = await Review.find({ entityId: entityId });

  if (entityType === "recipe") {
    const recipe = await Recipe.findOne({ _id: entityId });
    await recipe.updateRecipeRating(rating, reviews.length);
  } else {
    let reviewAmount = 1;
    if(reviews.length > 1) {
      reviewAmount = reviews.length;
    }

    const product_id = Number(entityId);
    const product = await pool.query(
      `SELECT avg_rating FROM product WHERE product_id = $1`,
      [product_id]
    );
    const current_rating = product.rows[0].avg_rating;
    const updatedRating = ((Number(current_rating) * (reviewAmount - 1)) + Number(rating)) / reviewAmount;

    await pool.query(
      "UPDATE product SET avg_rating = $1 WHERE product_id = $2 RETURNING *",
      [updatedRating, product_id]
    );
  }
};

exports.getReview = async (req, res) => {
  const entity_id = req.params.entityId;
  try {
    const reviews = await Review.find({ entity_id: entity_id });
    if(reviews === 0) {
      return res.status(404).json({ error: "No reviews available" })
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
    });
    await newReview.save();
    await updateRating(entityId, entityType, rating);
    res.status(200).json(newReview)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
