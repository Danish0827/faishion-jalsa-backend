// products.js
const express = require("express");
const app = express();
const pool = require("../config"); // Assuming you have a database connection configuration file
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
// const fs = require("fs/promises");
const fs = require("fs");
const sendEmail = require("./nodemailer");

app.use(express.json());
app.use(cors());

// file storage path
const fileconfigProducts = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/vendorsProductImages");
  },
  filename: (req, file, callback) => {
    const fileType = file.mimetype.startsWith("image") ? "Image" : "Video";
    callback(null, `${fileType}-${Date.now()} - ${file.originalname}`);
  },
});

// filter
const isFileMedia = (req, file, callback) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    callback(null, true);
  } else {
    callback(new Error("Only media files (images and videos) are allowed"));
  }
};

const uploadFiles = multer({
  storage: fileconfigProducts,
  fileFilter: isFileMedia,
});

// get all products
app.get("/getAllProducts", async (req, res) => {
  try {
    const query = "SELECT * FROM products";
    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (error) {
    console.log("Error fetching products: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// add product
app.post("/addProductByVendor", async (req, res) => {
  try {
    var { productData } = req.body;

    // Check if the 'productData' exists and is of type 'object'
    if (!productData || typeof productData !== "object") {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // Create a comma-separated list of column names from the keys in 'productData'
    const columnNames = Object.keys(productData).join(", ");

    // Create a comma-separated list of placeholders for parameterized query
    const placeholders = Object.keys(productData)
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    // Generate the SQL INSERT query
    const insertQuery = `INSERT INTO products (${columnNames}) VALUES (${placeholders}) RETURNING *`;

    // Create an array of values for the placeholders
    const values = Object.values(productData).map((value) => {
      // Check if the value is an array or an object, and stringify it if necessary
      if (Array.isArray(value) || typeof value === "object") {
        return JSON.stringify(value);
      }
      // Otherwise, use the value as is
      return value;
    });

    // // Log the SQL query and values for debugging
    // console.log("SQL Query:", insertQuery);
    // console.log("Parameter Values:", values);

    const client = await pool.connect();

    // Execute the SQL query with the provided values
    const result = await client.query(insertQuery, values);

    client.release();

    // Send a success response if the query is executed successfully
    res.status(200).json({
      status: 200,
      message: "Product added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    // Handle any errors that occur during database operations
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update product
app.post("/updateProductByVendor", async (req, res) => {
  try {
    var { productData, productId } = req.body;

    // Check if 'productData' exists and is of type 'object'
    if (!productData || typeof productData !== "object") {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // Create an array of key-value pairs for the columns to update
    const updateColumns = Object.keys(productData).map((key, index) => {
      const value = productData[key];
      // If the value is an array or object, update it as JSON
      const columnValue =
        Array.isArray(value) || typeof value === "object"
          ? `'${JSON.stringify(value)}'`
          : `'${value}'`;

      return `${key} = ${columnValue}`;
    });

    // Create a comma-separated list of columns to update
    const setClause = updateColumns.join(", ");

    // Generate the SQL UPDATE query with a WHERE condition to specify the record to update
    const updateQuery = `UPDATE products SET ${setClause}, updated_at = NOW() WHERE product_id = $1 RETURNING *`;

    const values = [productId];

    // // Log the SQL query and values for debugging
    // console.log("SQL Query:", updateQuery);
    // console.log("Parameter Values:", values);

    const client = await pool.connect();

    // Execute the SQL query with the provided values
    const result = await client.query(updateQuery, values);

    client.release();

    // Send a success response if the query is executed successfully
    res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    // Handle any errors that occur during database operations
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get product by ID
app.get("/getProductById/:id", async (req, res) => {
  try {
    const productId = req.params.id; // Extract the product ID from the URL parameter

    if (!productId) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const client = await pool.connect();

    // Query the database to retrieve the product data by ID
    const result = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [productId]
    );

    client.release();

    if (result.rows.length === 0) {
      // If no product is found with the given ID, return a 404 response
      return res.status(404).json({ error: "Product not found" });
    }

    // If a product is found, return it as the response
    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    // Handle any errors that occur during database operations
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get the products by applying the comparison (<, >, <=, >=, =, <>, !=), special (IS NULL, IS NOT NULL, IN, NOT IN, LIKE, NOT LIKE, BETWEEN, NOT BETWEEN)
app.post("/getProductsByFilter", async (req, res) => {
  try {
    // Define the initial SQL query and an array for parameter values
    let sqlQuery = "SELECT * FROM products WHERE 1 = 1";
    const values = [];

    // Iterate through query parameters
    let paramCount = 1; // Start with $1 as the first parameter
    for (const param in req.body) {
      if (req.body.hasOwnProperty(param)) {
        const condition = req.body[param];
        if (condition.field && condition.operator && condition.value) {
          if (condition.operator === "IN" || condition.operator === "NOT IN") {
            // Handle the IN/NOT IN operator
            const placeholders = condition.value.map(
              (_, index) => `$${paramCount + index}`
            );
            sqlQuery += ` AND ${condition.field} ${
              condition.operator
            } (${placeholders.join(", ")})`;
            values.push(...condition.value);
            paramCount += condition.value.length;
          } else if (
            (condition.operator === "IS NOT" || condition.operator === "IS") &&
            condition.value === "NULL"
          ) {
            // Handle the "IS/IS NOT NULL" condition
            sqlQuery += ` AND ${condition.field} ${condition.operator} NULL`;
          } else if (
            condition.operator === "BETWEEN" ||
            condition.operator === "NOT BETWEEN"
          ) {
            // Handle the BETWEEN IN/NOT BETWEEN operator
            const placeholders = condition.value.map(
              (_, index) => `$${paramCount + index}`
            );
            sqlQuery += ` AND ${condition.field} ${
              condition.operator
            } ${placeholders.join(" AND ")}`;
            values.push(...condition.value);
            paramCount += condition.value.length;
          } else {
            sqlQuery += ` AND ${condition.field} ${condition.operator} $${paramCount}`;
            values.push(condition.value);
            paramCount++;
          }
        }
      }
    }

    // // Log the SQL query and parameter values for debugging
    // console.log("SQL Query:", sqlQuery);
    // console.log("Parameter Values:", values);

    const client = await pool.connect();

    // Execute the SQL query with the provided values
    const result = await client.query(sqlQuery, values);

    client.release();

    // Send the retrieved records as the response
    res.status(200).json({ products: result.rows });
  } catch (error) {
    // Handle any errors that occur during database operations
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get products by category and subcategory
app.get(
  "/getProductsByCategorySubcategory/:category/:subcategory",
  async (req, res) => {
    try {
      const category = req.params.category;
      const subcategory = req.params.subcategory;

      if (!category || !subcategory) {
        return res
          .status(400)
          .json({ error: "Invalid category or subcategory" });
      }

      const client = await pool.connect();

      // Query the database to retrieve products by category and subcategory
      const result = await client.query(
        "SELECT * FROM products WHERE category_id = $1 AND subcategory_id = $2",
        [category, subcategory]
      );

      client.release();

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "No products found for the given category and subcategory",
        });
      }

      res.status(200).json({ products: result.rows });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// get products by vendor id
app.get("/getProductsByVendor/:vendorId", async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    if (!vendorId) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const client = await pool.connect();

    // Query the database to retrieve products by vendor ID
    const result = await client.query(
      "SELECT * FROM products WHERE vendor_id = $1",
      [vendorId]
    );

    client.release();

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for the given vendor" });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get products by subcategory
app.post("/getProductsBySubcategory", async (req, res) => {
  try {
    const subcategory = req.body.subcategory;

    if (!subcategory) {
      return res.status(400).json({ error: "Invalid subcategory" });
    }

    const client = await pool.connect();

    // Query the database to retrieve products by category and subcategory
    const result = await client.query(
      "SELECT * FROM products WHERE subcategory_id = $1",
      [subcategory]
    );

    client.release();

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for the given subcategory" });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete product by ID
app.post("/deleteProductByVendor", async (req, res) => {
  try {
    const productId = req.body.product_id; // Assuming you pass the product ID in the request body

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const client = await pool.connect();

    await client.query("DELETE FROM products WHERE product_id = $1", [
      productId,
    ]);

    client.release();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete products by IDs
app.post("/deleteProductsByVendor", async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds) {
      return res.status(400).json({ error: "Product IDs is required" });
    }

    const client = await pool.connect();

    const query = `DELETE FROM products WHERE product_id IN (${productIds.join(
      ", "
    )})`;

    await pool.query(query);

    client.release();

    res.status(200).json({ message: "Selected Products deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get rejected products for all categories
app.get("/getRejectedProducts", async (req, res) => {
  try {
    const client = await pool.connect();

    // Query the database to retrieve products by category and subcategory
    const result = await client.query(
      "SELECT * FROM products WHERE product_status = 2"
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No products found",
      });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upload Bulk Product
app.post("/uploadBulkProducts", async (req, res) => {
  const { productData } = req.body;

  if (!productData || !Array.isArray(productData) || productData.length === 0) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  try {
    const tableName = "products"; // Change this to your actual table name
    const firstProduct = productData[0];
    const columns = Object.keys(firstProduct).join(", ");

    const values = await Promise.all(
      productData.map(async (data) => {
        const columnValues = Object.values(data).map((value) => {
          if (typeof value === "string") {
            return `'${value}'`;
          } else {
            return value;
          }
        });
        return `(${columnValues.join(", ")})`;
      })
    );

    const query = `INSERT INTO ${tableName} (${columns}) VALUES ${values.join(
      ", "
    )}`;
    await pool.query(query);
    res.status(200).json({ message: "Data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).json({ error: "Error uploading data" });
  }
});

// Get Vendor Products by Admin
app.get("/getVendorProducts", async (req, res) => {
  try {
    const client = await pool.connect();

    // Query the database to retrieve products by category and subcategory
    const result = await client.query(
      "SELECT p.*, v.* FROM products p JOIN vendors v ON p.vendor_id = v.id"
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No products found",
      });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// reject product by Admin
app.post("/rejectProduct", async (req, res) => {
  try {
    const { productId, rejectReason } = req.body;

    const updateQuery = `UPDATE products 
                        SET product_status = 2, rejection_reason = $1, updated_at = NOW()
                        WHERE product_id = $2`;

    const updateValues = [rejectReason, productId];
    await pool.query(updateQuery, updateValues);
    res.status(200).json({ message: "Product rejected successfully" });
  } catch (error) {
    console.error("Error rejecting product:", error);
    res.status(500).json({ error: "Failed to reject the product" });
  }
});

// approve product by Admin
app.post("/approveProduct", async (req, res) => {
  try {
    const { productId } = req.body;

    const updateQuery = `UPDATE products 
                        SET product_status = 1, updated_at = NOW(), rejection_reason = NULL
                        WHERE product_id = $1`;

    const updateValues = [productId];
    await pool.query(updateQuery, updateValues);
    res.status(200).json({ message: "Product approved successfully" });
  } catch (error) {
    console.error("Error rejecting product:", error);
    res.status(500).json({ error: "Failed to reject the product" });
  }
});

// Create a new review for a product
app.post(
  "/products/:product_id/reviews",
  uploadFiles.array("review_media", 5),
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const { customer_id, rating, title, content } = req.body;

      // Retrieve file paths from the uploaded files
      const attachmentPaths = req.files.map((file) => file.path);

      const insertReviewQuery = `
      INSERT INTO productreviews (product_id, customer_id, rating, title, content, review_media)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING review_id;
    `;

      const values = [
        product_id,
        customer_id,
        rating,
        title,
        content,
        JSON.stringify(attachmentPaths),
      ];

      const result = await pool.query(insertReviewQuery, values);

      if (result.rowCount === 1) {
        const newReviewId = result.rows[0].review_id;

        // calculate the updated ratings and review_count of the product
        const updateProductQuery = `
          UPDATE products
          SET ratings = (SELECT AVG(rating) FROM productreviews WHERE product_id = $1),
              review_count = (SELECT count(*) FROM productreviews WHERE product_id = $1)
          WHERE product_id = $1;
        `;

        await pool.query(updateProductQuery, [product_id]);

        res.status(201).json({
          message: "Review added successfully",
          review_id: newReviewId,
        });
      } else {
        res.status(500).json({ message: "Failed to add the review" });
      }
    } catch (error) {
      console.error("Error while adding the review: " + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = app;
