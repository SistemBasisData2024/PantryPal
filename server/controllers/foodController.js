const Food = require("../models/FoodModel");
const Review = require("../models/ReviewModel");
const Recipe = require("../models/RecipeModel");

exports.getFood = async (req, res) => {
  try {
    const food = await Food.find();
    res.status(200).json(food);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getFoodById = async (req, res) => {
  const foodId = req.params.foodId;
  try {
    const food = await Food.findOne({ _id: foodId }).populate({
      path: "recipes",
      model: Recipe,
    });
    if(!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    res.status(200).json(food);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getRecipeById = async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const recipe = await Recipe.findOne({ _id: recipeId });
    if(!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

exports.addFood = async (req, res) => {
  const { name, description, image, cuisine } = req.body;
  try {
    const newFood = new Food({
      name,
      description,
      image,
      cuisine,
      recipes: [] 
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const { name, foodId, products } = req.body;

    const newRecipe = new Recipe({
      name: name,
      food: foodId,
      products: products
    });
    const savedRecipe = await newRecipe.save();

    await Food.findByIdAndUpdate(foodId, { $push: { recipes: savedRecipe._id } });

    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateFood = async (req, res) => {
  const { foodId } = req.params; 
  const updateData = req.body;
  if(updateData.recipe === undefined || !Array.isArray(updateData.recipe)) {
    updateData.recipe = [];
  }
  try {
    const updatedFood = await Food.findByIdAndUpdate(foodId, updateData, { new: true });
    if(!updatedFood) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params; 
    const updateData = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true });
    if(!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  const { foodId } = req.params;
  try {
    await Food.findByIdAndDelete(foodId);
    res.status(200).json({ message: "Food succesfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Food.findByIdAndUpdate(recipe.food, { $pull: { recipes: recipeId } });
    await Recipe.findByIdAndDelete(recipeId);
    await Review.deleteMany({ entityId: recipeId });

    res.status(200).json({ message: "Recipe successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};