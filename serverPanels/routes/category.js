// vendor.js

const express = require("express");
const app = express();
const pool = require("../config");
const bcrypt = require("bcrypt");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/getAllProductCatgeory", async (req, res) => {
  try {
    const query = "SELECT * FROM categories";

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addNewCategories", async (req, res) => {
  try {
    const {
      category_name,
      category_description,
      category_image_url,
      category_status,
      category_type,
      category_meta_title,
    } = req.body.values;

    // Check if the category with the given name already exists in the database
    const checkQuery = "SELECT * FROM categories WHERE category_name = $1";
    const checkValues = [category_name];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      // Category with the given name already exists
      return res.status(409).json({ error: "Category already exists." });
    }

    // If the category doesn't exist, proceed with the insertion
    const insertQuery =
      "INSERT INTO categories (category_name, category_description, category_image_url, category_status, category_type, category_meta_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const insertValues = [
      category_name,
      category_description,
      category_image_url,
      category_status,
      category_type,
      category_meta_title,
    ];
    const { rows } = await pool.query(insertQuery, insertValues);

    res.status(201).json(rows[0]); // Return the newly inserted category data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/updateCategory", async (req, res) => {
  console.log(req.body);
  try {
    const categoryId = req.body.selectedKey; // Get the category ID from the URL parameter
    const {
      category_name,
      category_description,
      category_image_url,
      category_status,
      category_type,
      category_meta_title,
    } = req.body.values;

    // Check if the category with the given ID exists in the database
    const checkQuery = "SELECT * FROM categories WHERE category_id = $1";
    const checkValues = [categoryId];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Category with the given ID does not exist
      return res.status(404).json({ error: "Category not found." });
    }

    // If the category exists, proceed with the update
    const updateQuery =
      "UPDATE categories SET category_name = $1, category_description = $2, category_image_url = $3, category_status = $5, category_type = $6, category_meta_title = $7 WHERE category_id = $4 RETURNING *";
    const updateValues = [
      category_name,
      category_description,
      category_image_url,
      categoryId,
      category_status,
      category_type,
      category_meta_title,
    ];
    const { rows } = await pool.query(updateQuery, updateValues);

    res.status(200).json(rows[0]); // Return the updated category data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deleteCategory", async (req, res) => {
  try {
    const categoryId = req.body.selectedKey; // Get the category ID from the request body

    // Check if the category with the given ID exists in the database
    const checkQuery = "SELECT * FROM categories WHERE category_id = $1";
    const checkValues = [categoryId];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Category with the given ID does not exist
      return res.status(404).json({ error: "Category not found." });
    }

    // If the category exists, proceed with the deletion

    // Delete the subcategories associated with the category (with matching parent_category_id)
    const deleteSubcategoriesQuery =
      "DELETE FROM subcategories WHERE parent_category_id = $1";
    await pool.query(deleteSubcategoriesQuery, [categoryId]);

    // Now, delete the main category from the 'categories' table
    const deleteCategoryQuery = "DELETE FROM categories WHERE category_id = $1";
    await pool.query(deleteCategoryQuery, [categoryId]);

    res.status(204).end(); // Return 204 No Content status to indicate successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
