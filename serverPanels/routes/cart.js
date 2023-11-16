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

// Route to add a product to the cart
app.post("/cart/add", async (req, res) => {
  try {
    const {
      customer_id,
      product_id,
      quantity,
      product_color,
      product_size,
      add_ons,
    } = req.body;
    const created_at = new Date(); // You can use a library like `moment` for better date formatting

    // Sort the `add_ons` array if it's present, or create an empty array if not
    const sortedAddOns = add_ons
      ? JSON.stringify(add_ons.sort())
      : JSON.stringify([]);

    // Check if the product already exists in the customer's cart
    const existingCartItem = await pool.query(
      "SELECT * FROM cart WHERE customer_id = $1 AND product_id = $2 AND product_color = $3 AND product_size = $4 AND add_ons = $5",
      [customer_id, product_id, product_color, product_size, sortedAddOns]
    );

    if (existingCartItem.rows.length > 0) {
      // Product already exists in the cart, update the quantity, color, size, and add-ons
      const updatedQuantity =
        parseInt(existingCartItem.rows[0].quantity) + parseInt(quantity);

      await pool.query(
        "UPDATE cart SET quantity = $1, product_color = $2, product_size = $3, add_ons = $4, updated_at = $5 WHERE customer_id = $6 AND product_id = $7 AND cart_id = $8",
        [
          updatedQuantity,
          product_color,
          product_size,
          sortedAddOns,
          created_at,
          customer_id,
          product_id,
          existingCartItem.rows[0].cart_id,
        ]
      );

      res.status(200).json({
        message: "Product quantity updated in the cart",
        cart_id: existingCartItem.rows[0].cart_id,
      });
    } else {
      // Product doesn't exist in the cart, insert a new row with color, size, and add-ons
      const insertResult = await pool.query(
        "INSERT INTO cart (customer_id, product_id, quantity, product_color, product_size, add_ons, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING *",
        [
          customer_id,
          product_id,
          quantity,
          product_color,
          product_size,
          sortedAddOns,
          created_at,
        ]
      );

      res.status(201).json({
        message: "Product added to the cart successfully",
        cart_id: insertResult.rows[0].cart_id,
      });
    }
  } catch (error) {
    console.error("Error while adding product to the cart: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update or remove a product from the cart by cart_id
app.post("/cart/remove", async (req, res) => {
  try {
    const { cart_id } = req.body;

    if (cart_id) {
      // Check if the cart_id exists in the cart
      const existingCartItem = await pool.query(
        "SELECT quantity FROM cart WHERE cart_id = $1",
        [cart_id]
      );

      if (existingCartItem.rows.length > 0) {
        const { quantity } = existingCartItem.rows[0];

        if (quantity > 1) {
          // If the current quantity is greater than 1, decrease it by 1
          const updatedQuantity = quantity - 1;
          const updated_at = new Date();

          await pool.query(
            "UPDATE cart SET quantity = $1, updated_at = $2 WHERE cart_id = $3",
            [updatedQuantity, updated_at, cart_id]
          );

          res
            .status(200)
            .json({ message: "Product quantity updated in the cart" });
        } else {
          // If the current quantity is 1, remove the product from the cart
          await pool.query("DELETE FROM cart WHERE cart_id = $1", [cart_id]);

          res
            .status(200)
            .json({ message: "Product removed from the cart successfully" });
        }
      } else {
        // Cart not found
        res.status(404).json({ message: "Cart not found" });
      }
    } else {
      // Invalid request, missing parameters
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    console.error(
      "Error while updating/removing product from the cart: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the cart details of a customer with product data
app.get("/cart/:customer_id", async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    // Retrieve the cart details and join with product data
    const query = `
      SELECT c.cart_id, c.customer_id, c.product_id, c.quantity, c.product_color, c.product_size, c.add_ons, c.created_at, c.updated_at,
             p.product_name, p.brand, p.price, p.discount, p.product_images, p.add_ons product_add_ons
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.customer_id = $1;
    `;

    const { rows } = await pool.query(query, [customer_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error while fetching cart details: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all carts grouped by customer with product data and category/subcategory names
app.get("/carts/all", async (req, res) => {
  try {
    // Retrieve all cart data grouped by customer and include product data and category/subcategory names
    const query = `
      SELECT
        c.customer_id,
        CONCAT(cust.given_name, ' ', cust.family_name) AS customer_name,
        cust.email AS customer_email,
        cust.phone_number AS customer_phone,
        json_agg(
          json_build_object(
            'cart_id', c.cart_id,
            'product_id', c.product_id,
            'quantity', c.quantity,
            'product_color', c.product_color,
            'product_size', c.product_size,
            'add_ons', c.add_ons,
            'created_at', c.created_at,
            'updated_at', c.updated_at,
            'product_name', p.product_name,
            'brand', p.brand,
            'price', p.price,
            'discount', p.discount,
            'product_images', p.product_images,
            'product_add_ons', p.add_ons,
            'category_name', cat.category_name,
            'subcategory_name', subcat.subcategory_name
          )
        ) AS carts
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      JOIN subcategories subcat ON p.subcategory_id = subcat.subcategory_id
      JOIN categories cat ON subcat.parent_category_id = cat.category_id
      JOIN customers cust ON c.customer_id = cust.customer_id
      GROUP BY c.customer_id, cust.customer_id;
    `;

    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error while fetching cart details: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete all products from a customer's cart that is empty his cart
app.delete("/cart/empty/:customer_id", async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    // Delete all cart items for the specified customer
    const deletedProducts = await pool.query(
      "DELETE FROM cart WHERE customer_id = $1 RETURNING cart_id",
      [customer_id]
    );

    const cartIds = deletedProducts.rows.map((item) => item.cart_id);

    res
      .status(200)
      .json({ message: "All products removed from the cart", data: cartIds });
  } catch (error) {
    console.error(
      "Error while removing products from the cart: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
