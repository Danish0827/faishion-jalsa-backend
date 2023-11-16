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

function generateOrderID() {
  // Get the current timestamp (in milliseconds since epoch)
  const timestamp = Date.now();

  return timestamp;
}

// Create an Order
app.post("/orders", async (req, res) => {
  try {
    // Extract order data from the request body
    const { customer_id, total_amount, order_date, currency, order_status } =
      req.body;

    // Assuming you have a function to generate order_id
    const order_id = generateOrderID();

    // Insert the new order into the Orders table
    const insertOrderQuery = `
        INSERT INTO orders (order_id, customer_id, order_date, total_amount, currency, order_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

    const values = [
      order_id,
      customer_id,
      order_date || new Date(),
      total_amount,
      currency,
      order_status,
    ];

    // Execute the SQL query to create the order
    const result = await pool.query(insertOrderQuery, values);

    if (result.rowCount === 1) {
      res.status(201).json({ message: "Order created successfully", order_id });
    } else {
      res.status(500).json({ message: "Failed to create the order" });
    }
  } catch (error) {
    console.error("Error while creating the order: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Order
app.put("/orders/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;

    // Extract order data to be updated from the request body
    const { total_amount, order_date, currency, order_status } = req.body;

    // Check if the order exists
    const checkOrderQuery = `
      SELECT * FROM orders
      WHERE order_id = $1
    `;

    const checkResult = await pool.query(checkOrderQuery, [order_id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Construct the SQL query for updating the order
    const updateOrderQuery = `
      UPDATE orders
      SET
        total_amount = COALESCE($1, total_amount),
        order_date = COALESCE($2, order_date),
        currency = COALESCE($3, currency),
        order_status = COALESCE($4, order_status)
      WHERE order_id = $5
      RETURNING *
    `;

    const values = [total_amount, order_date, currency, order_status, order_id];

    // Execute the SQL query to update the order
    const updateResult = await pool.query(updateOrderQuery, values);

    if (updateResult.rowCount === 1) {
      res.status(200).json({
        message: "Order updated successfully",
        updated_order: updateResult.rows[0],
      });
    } else {
      res.status(500).json({ message: "Failed to update the order" });
    }
  } catch (error) {
    console.error("Error while updating the order: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Order Details
app.get("/orders/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;

    // Query the database to retrieve the specific order and its related order items and transactions
    const getOrderDetailsQuery = `
        SELECT
        o.order_id,
        o.customer_id,
        CONCAT(c.given_name, ' ', c.family_name) AS customer_name,
        o.order_date,
        o.total_amount,
        o.currency,
        o.order_status,
        o.order_updated_date,
        (
          SELECT json_agg(
            json_build_object(
              'order_id', oi.order_id,
              'order_item_id', oi.order_item_id,
              'product_id', oi.product_id,
              'product_name', p.product_name,
              'vendor_id', p.vendor_id,
              'vendor_name', v.vendorname,
              'quantity', oi.quantity,
              'price', oi.price,
              'currency', oi.currency,
              'product_color', oi.product_color,
              'product_size', oi.product_size,
              'add_ons', oi.add_ons,
              'order_item_status', oi.order_item_status,
              'cancellation_reason', oi.cancellation_reason,
              'statusupdate_date', oi.statusupdate_date
            )
          )
          FROM orderitems oi
          LEFT JOIN products p ON p.product_id = oi.product_id
          LEFT JOIN vendors v ON p.vendor_id = v.id
          WHERE oi.order_id = o.order_id
        ) as order_items,
        (
          SELECT json_agg(
            json_build_object(
              'payment_id', pt.payment_id,
              'transaction_id', pt.transaction_id,
              'payment_date', pt.payment_date,
              'amount', pt.amount,
              'payment_method', pt.payment_method
            )
          )
          FROM paymenttransactions pt
          WHERE pt.order_id = o.order_id
        ) as payment_transactions
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = $1;
    `;

    const result = await pool.query(getOrderDetailsQuery, [order_id]);

    if (result.rowCount === 1) {
      const orderDetails = result.rows[0];
      res.status(200).json(orderDetails);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error while fetching order details: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Customer Orders
app.get("/orders/customer/:customer_id", async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    // Query the database to retrieve all orders for the specific customer, including order items and payment transactions
    const getCustomerOrdersQuery = `
      SELECT
        o.order_id,
        o.customer_id,
        o.order_date,
        o.total_amount,
        o.currency,
        o.order_status,
        o.order_updated_date,
        (
          SELECT json_agg(
            json_build_object(
              'order_id', oi.order_id,
              'order_item_id', oi.order_item_id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'currency', oi.currency,
              'product_color', oi.product_color,
              'product_size', oi.product_size,
              'add_ons', oi.add_ons
            )
          )
          FROM orderitems oi
          WHERE oi.order_id = o.order_id
        ) as order_items,
        (
          SELECT json_agg(
            json_build_object(
              'payment_id', pt.payment_id,
              'transaction_id', pt.transaction_id,
              'payment_date', pt.payment_date,
              'amount', pt.amount,
              'payment_method', pt.payment_method
            )
          )
          FROM paymenttransactions pt
          WHERE pt.order_id = o.order_id
        ) as payment_transactions
      FROM orders o
      WHERE o.customer_id = $1;
    `;

    const result = await pool.query(getCustomerOrdersQuery, [customer_id]);

    if (result.rowCount > 0) {
      const customerOrders = result.rows;
      res.status(200).json(customerOrders);
    } else {
      res.status(404).json({ message: "No orders found for this customer" });
    }
  } catch (error) {
    console.error("Error while fetching customer orders: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Order Item
app.post("/order-items", async (req, res) => {
  try {
    // Extract order item data from the request body
    const {
      order_id,
      product_id,
      quantity,
      price,
      currency,
      product_color,
      product_size,
      add_ons,
    } = req.body;

    // Insert the new order item into the OrderItems table
    const insertOrderItemQuery = `
        INSERT INTO orderitems (order_id, product_id, quantity, price, currency, product_color, product_size, add_ons, order_item_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

    const values = [
      order_id,
      product_id,
      quantity,
      price,
      currency,
      product_color,
      product_size,
      JSON.stringify(add_ons),
      "Pending",
    ];

    // Execute the SQL query to create the order item
    const result = await pool.query(insertOrderItemQuery, values);

    if (result.rowCount === 1) {
      const order_item_id = result.rows[0].order_item_id;
      res
        .status(201)
        .json({ message: "Order item added successfully", order_item_id });
    } else {
      res.status(500).json({ message: "Failed to add the order item" });
    }
  } catch (error) {
    console.error("Error while adding the order item: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Order Item - Update price and quantity
app.put("/order-items/:order_item_id", async (req, res) => {
  try {
    const order_item_id = req.params.order_item_id;

    // Extract the order item data to be updated from the request body
    const { quantity, price } = req.body;

    // Check if the order item exists
    const checkOrderItemQuery = `
      SELECT * FROM orderitems
      WHERE order_item_id = $1
    `;

    const checkResult = await pool.query(checkOrderItemQuery, [order_item_id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Construct the SQL query for updating the order item
    const updateOrderItemQuery = `
      UPDATE orderitems
      SET
        quantity = COALESCE($1, quantity),
        price = COALESCE($2, price)
      WHERE order_item_id = $3
      RETURNING *
    `;

    const values = [quantity, price, order_item_id];

    // Execute the SQL query to update the order item
    const updateResult = await pool.query(updateOrderItemQuery, values);

    if (updateResult.rowCount === 1) {
      res.status(200).json({
        message: "Order item updated successfully",
        updated_order_item: updateResult.rows[0],
      });
    } else {
      res.status(500).json({ message: "Failed to update the order item" });
    }
  } catch (error) {
    console.error("Error while updating the order item: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove Order Item
app.delete("/order-items/:order_item_id", async (req, res) => {
  try {
    const order_item_id = req.params.order_item_id;

    // Check if the order item exists
    const checkOrderItemQuery = `
      SELECT * FROM orderitems
      WHERE order_item_id = $1
    `;

    const checkResult = await pool.query(checkOrderItemQuery, [order_item_id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Construct the SQL query for deleting the order item
    const deleteOrderItemQuery = `
      DELETE FROM orderitems
      WHERE order_item_id = $1
      RETURNING *
    `;

    // Execute the SQL query to delete the order item
    const deleteResult = await pool.query(deleteOrderItemQuery, [
      order_item_id,
    ]);

    if (deleteResult.rowCount === 1) {
      res.status(200).json({
        message: "Order item removed successfully",
        removed_order_item: deleteResult.rows[0],
      });
    } else {
      res.status(500).json({ message: "Failed to remove the order item" });
    }
  } catch (error) {
    console.error("Error while removing the order item: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Order Status History
app.get("/order-status-history/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;

    // Query the database to retrieve the order status history for the specific order
    const getOrderStatusHistoryQuery = `
      SELECT * FROM orderstatushistory
      WHERE order_id = $1
    `;

    const result = await pool.query(getOrderStatusHistoryQuery, [order_id]);

    if (result.rowCount > 0) {
      const orderStatusHistory = result.rows;
      res.status(200).json(orderStatusHistory);
    } else {
      res
        .status(404)
        .json({ message: "No order status history found for this order" });
    }
  } catch (error) {
    console.error(
      "Error while fetching order status history: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Order Status History
app.post("/order-status-history", async (req, res) => {
  try {
    // Extract order status history data from the request body
    const { order_id, order_status, status_date } = req.body;

    // Insert the new order status history entry into the OrderStatusHistory table
    const insertOrderStatusHistoryQuery = `
        INSERT INTO orderstatushistory (order_id, order_status, status_date)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

    const values = [order_id, order_status, status_date || new Date()];

    // Execute the SQL query to add the order status history
    const result = await pool.query(insertOrderStatusHistoryQuery, values);

    if (result.rowCount === 1) {
      res.status(201).json({
        message: "Order status history added successfully",
        status_id: result.rows[0].status_id,
      });
    } else {
      res.status(500).json({ message: "Failed to add order status history" });
    }
  } catch (error) {
    console.error("Error while adding order status history: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Order Status And Add the previous status in the Order status history
app.put("/orders/:order_id/status", async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const { order_status } = req.body;

    // Query the database to get the current status of the order
    const getCurrentStatusQuery = `
      SELECT order_status, order_updated_date FROM orders
      WHERE order_id = $1
    `;
    const currentStatusResult = await pool.query(getCurrentStatusQuery, [
      order_id,
    ]);

    if (currentStatusResult.rowCount !== 1) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = currentStatusResult.rows[0].order_status;
    const currentUpdatedDate = currentStatusResult.rows[0].order_updated_date;

    // Proceed to update the order status with the new status
    const updateStatusQuery = `
      UPDATE orders
      SET order_status = $1, order_updated_date = $3
      WHERE order_id = $2
    `;
    const updateStatusResult = await pool.query(updateStatusQuery, [
      order_status,
      order_id,
      new Date(),
    ]);

    if (updateStatusResult.rowCount === 1) {
      // Insert the previous status into the orderstatushistory table
      const insertStatusHistoryQuery = `
        INSERT INTO orderstatushistory (order_id, order_status, status_date)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const statusHistoryValues = [order_id, currentStatus, currentUpdatedDate];
      const statusHistoryResult = await pool.query(
        insertStatusHistoryQuery,
        statusHistoryValues
      );

      if (statusHistoryResult.rowCount === 1) {
        return res
          .status(200)
          .json({ message: "Order status updated successfully" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to add status history" });
      }
    } else {
      return res
        .status(500)
        .json({ message: "Failed to update the order status" });
    }
  } catch (error) {
    console.error("Error while updating order status: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all order details
app.get("/orders-all", async (req, res) => {
  try {
    // Query the database to retrieve all orders and their related order items and transactions
    const getAllOrdersQuery = `
        SELECT
        o.order_id,
        o.customer_id,
        CONCAT(c.given_name, ' ', c.family_name) AS customer_name,
        o.order_date,
        o.total_amount,
        o.currency,
        o.order_status,
        o.order_updated_date,
        (
          SELECT json_agg(
            json_build_object(
              'order_id', oi.order_id,
              'order_item_id', oi.order_item_id,
              'product_id', oi.product_id,
              'product_name', p.product_name,
              'vendor_id', p.vendor_id,
              'vendor_name', v.vendorname,
              'quantity', oi.quantity,
              'price', oi.price,
              'currency', oi.currency,
              'product_color', oi.product_color,
              'product_size', oi.product_size,
              'add_ons', oi.add_ons,
              'order_item_status', oi.order_item_status,
              'cancellation_reason', oi.cancellation_reason,
              'statusupdate_date', oi.statusupdate_date
            )
          )
          FROM orderitems oi
          LEFT JOIN products p ON p.product_id = oi.product_id
          LEFT JOIN vendors v ON p.vendor_id = v.id
          WHERE oi.order_id = o.order_id
        ) as order_items,
        (
          SELECT json_agg(
            json_build_object(
              'payment_id', pt.payment_id,
              'transaction_id', pt.transaction_id,
              'payment_date', pt.payment_date,
              'amount', pt.amount,
              'payment_method', pt.payment_method
            )
          )
          FROM paymenttransactions pt
          WHERE pt.order_id = o.order_id
        ) as payment_transactions
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
    `;

    const result = await pool.query(getAllOrdersQuery);

    if (result.rowCount > 0) {
      const orderDetails = result.rows;
      res.status(200).json(orderDetails);
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    console.error("Error while fetching order details: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all order of a particular vendor
app.get("/orders/vendor/:vendor_id", async (req, res) => {
  try {
    const vendorId = req.params.vendor_id;

    // Query the database to retrieve all orders for the specific vendor
    const getVendorOrdersQuery = `
      SELECT
          o.order_id,
          o.customer_id,
          CONCAT(c.given_name, ' ', c.family_name) AS customer_name,
          o.order_date,
          o.total_amount,
          o.currency,
          o.order_status,
          o.order_updated_date,
          (
              SELECT json_agg(
                  json_build_object(
                      'order_id', oi.order_id,
                      'order_item_id', oi.order_item_id,
                      'product_id', oi.product_id,
                      'product_name', p.product_name,
                      'vendor_id', p.vendor_id,
                      'vendor_name', v.vendorname,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'currency', oi.currency,
                      'product_color', oi.product_color,
                      'product_size', oi.product_size,
                      'add_ons', oi.add_ons,
                      'order_item_status', oi.order_item_status,
                      'cancellation_reason', oi.cancellation_reason,
                      'statusupdate_date', oi.statusupdate_date
                  )
              )
              FROM orderitems oi
              LEFT JOIN products p ON p.product_id = oi.product_id
              LEFT JOIN vendors v ON p.vendor_id = v.id
              WHERE oi.order_id = o.order_id AND p.vendor_id = $1
          ) as order_items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE EXISTS (
          SELECT 1
          FROM orderitems oi
          LEFT JOIN products p ON p.product_id = oi.product_id
          WHERE oi.order_id = o.order_id AND p.vendor_id = $1

      )
      GROUP BY o.order_id, o.customer_id, o.order_date, o.total_amount, o.currency, o.order_status, o.order_updated_date, customer_name;
    `;

    const result = await pool.query(getVendorOrdersQuery, [vendorId]);

    if (result.rowCount > 0) {
      const vendorOrders = result.rows;
      res.status(200).json(vendorOrders);
    } else {
      res.status(404).json({ message: "No orders found for this vendor" });
    }
  } catch (error) {
    console.error("Error while fetching vendor orders: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update status of a item in a Order by a vendor
app.post("/orders/order_item_status", async (req, res) => {
  try {
    const { order_item_id, order_item_status, cancellation_reason } = req.body;

    const checkOrderItemQuery = `
      SELECT * FROM orderitems
      WHERE order_item_id = $1
    `;

    const checkResult = await pool.query(checkOrderItemQuery, [order_item_id]);
    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    const cancelOrderItemQuery = `
      UPDATE orderitems
      SET order_item_status = $1, cancellation_reason = $2
      WHERE order_item_id = $3
      RETURNING *
    `;

    const values = [order_item_status, cancellation_reason, order_item_id];

    const cancelResult = await pool.query(cancelOrderItemQuery, values);

    if (cancelResult.rowCount === 1) {
      res.status(200).json({
        message: "Order item canceled successfully",
      });
    } else {
      res.status(500).json({ message: "Failed to cancel the order item" });
    }
  } catch (error) {
    console.error("Error while cancelling the order item: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
