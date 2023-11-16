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

app.get("/getAllSubcategories", async (req, res) => {
  try {
    const query = "SELECT * FROM subcategories";

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update a subcategory
app.post("/updateSubcategory", async (req, res) => {
  try {
    const {
      selectedSubcategory,
      subcategory_name,
      subcategory_description,
      subcategory_image_url,
      subcategory_meta_title
    } = req.body;

    // Check if the subcategory with the given ID exists in the database
    const checkQuery = "SELECT * FROM subcategories WHERE subcategory_id = $1";
    const checkValues = [selectedSubcategory];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Subcategory with the given ID does not exist
      return res.status(404).json({ error: "Subcategory not found." });
    }

    // Update the subcategory in the database, including the updated_at column
    const updateQuery =
      "UPDATE subcategories SET subcategory_name = $1, subcategory_description = $2, subcategory_image_url = $3, subcategory_meta_title = $5, updated_at = NOW() WHERE subcategory_id = $4";
    const updateValues = [
      subcategory_name,
      subcategory_description,
      subcategory_image_url,
      selectedSubcategory,
      subcategory_meta_title
    ];

    await pool.query(updateQuery, updateValues);

    res.status(200).json({ message: "Subcategory updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addNewSubCategories", async (req, res) => {
  try {
    const { selectedKey } = req.body;
    const { subcategory_name, subcategory_description, subcategory_image_url, subcategory_meta_title } =
      req.body.values;

    // Check if the parent category exists
    const checkCategoryQuery =
      "SELECT * FROM categories WHERE category_id = $1";
    const checkCategoryValues = [selectedKey];
    const checkCategoryResult = await pool.query(
      checkCategoryQuery,
      checkCategoryValues
    );

    if (checkCategoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Parent category not found." });
    }

    // Insert the new subcategory into the database
    const insertQuery =
      "INSERT INTO subcategories (subcategory_name, subcategory_description, subcategory_image_url, parent_category_id, subcategory_meta_title) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const insertValues = [
      subcategory_name,
      subcategory_description,
      subcategory_image_url,
      selectedKey,
      subcategory_meta_title
    ];
    const result = await pool.query(insertQuery, insertValues);

    // Return the newly added subcategory data
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a subcategory by ID
app.post("/deleteSubcategory", async (req, res) => {
  try {
    const { subcategory_id } = req.body;
    // Check if the subcategory exists in the database
    const checkQuery = "SELECT * FROM subcategories WHERE subcategory_id = $1";
    const checkValues = [subcategory_id];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Subcategory not found." });
    }

    // If the subcategory exists, proceed with the deletion
    const deleteQuery = "DELETE FROM subcategories WHERE subcategory_id = $1";
    await pool.query(deleteQuery, [subcategory_id]);

    res.status(204).end(); // Return 204 No Content status to indicate successful deletion
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... (export router)

module.exports = app;
