const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Route to add a product to the wishlist
app.post("/wishlist/add", async (req, res) => {
  const { product_id, customer_id } = req.body;

  try {
    // Check if the combination of product_id and customer_id already exists
    const checkQuery =
      "SELECT * FROM customer_wishlist WHERE product_id = $1 AND customer_id = $2";
    const result = await pool.query(checkQuery, [product_id, customer_id]);

    if (result.rows.length > 0) {
      // Combination already exists, return an error response
      res.status(400).json({ message: "Product is already in the wishlist" });
      return;
    }

    // Combination doesn't exist, add the product to the wishlist
    const insertQuery =
      "INSERT INTO customer_wishlist (product_id, customer_id, added_date) VALUES ($1, $2, NOW()) RETURNING *";
    const data = await pool.query(insertQuery, [product_id, customer_id]);

    res.status(201).json({
      message: "Product added to wishlist successfully",
      data: data.rows[0],
    });
  } catch (error) {
    console.error("Error while adding product to wishlist: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to remove a product from the wishlist
app.post("/wishlist/remove", async (req, res) => {
  const { product_id, customer_id, wishlist_id } = req.body;

  try {
    if ((product_id && customer_id) || wishlist_id) {
      let deleteQuery;
      let params;

      if (wishlist_id) {
        // Delete by wishlist_id if provided
        deleteQuery = "DELETE FROM customer_wishlist WHERE wishlist_id = $1";
        params = [wishlist_id];
      } else if (product_id && customer_id) {
        // Delete by product_id and customer_id if provided
        deleteQuery =
          "DELETE FROM customer_wishlist WHERE product_id = $1 AND customer_id = $2";
        params = [product_id, customer_id];
      }

      const result = await pool.query(deleteQuery, params);

      if (result.rowCount === 0) {
        // No rows were deleted, return an error response
        res.status(404).json({ message: "Product not found in the wishlist" });
        return;
      }

      res
        .status(200)
        .json({ message: "Product removed from wishlist successfully" });
    } else {
      // Invalid request, missing parameters
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    console.error(
      "Error while removing product from wishlist: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all wishlists with customer and product data grouped by customer
app.get("/wishlist/all", async (req, res) => {
  try {
    const query = `
            WITH CustomerDetails AS (
                SELECT
                c.customer_id,
                c.given_name AS customer_name,
                c.email AS customer_email
                FROM customers c
            )
            SELECT
                cd.customer_id,
                cd.customer_name,
                cd.customer_email,
                json_agg(json_build_object(
                'wishlist_id', w.wishlist_id,
                'added_date', w.added_date,
                'product_id', p.product_id,
                'product_name', p.product_name,
                'brand', p.brand,
                'price', p.price,
                'discount', p.discount,
                'product_images', p.product_images
                )) AS wishlists
            FROM CustomerDetails cd
            INNER JOIN customer_wishlist w ON w.customer_id = cd.customer_id
            INNER JOIN products p ON w.product_id = p.product_id
            GROUP BY cd.customer_id, cd.customer_name, cd.customer_email;
        `;

    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error while fetching wishlists: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get wishlist data for a specific customer
app.get("/wishlist/customer/:customer_id", async (req, res) => {
  const customer_id = req.params.customer_id;

  try {
    const query = `
        SELECT
          w.wishlist_id,
          w.added_date,
          p.product_id,
          p.product_name,
          p.brand,
          p.price,
          p.discount,
          p.product_images
        FROM customer_wishlist w
        LEFT JOIN products p ON w.product_id = p.product_id
        WHERE w.customer_id = $1;
      `;

    const { rows } = await pool.query(query, [customer_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error(
      "Error while fetching wishlist data for customer: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
