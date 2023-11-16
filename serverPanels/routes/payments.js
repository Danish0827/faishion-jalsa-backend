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

app.get("/earnings/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;

  try {
    // SQL query to fetch the full row, total earning, and pending amount for a specific vendor
    const query = `
        SELECT
        p.*,
        COALESCE(
            (
                SELECT
                    SUM(payment_amount)
                FROM
                    payments sub
                WHERE
                    sub.vendor_id = p.vendor_id
                    AND sub.payment_status = 'Paid'
            ), 0) AS total_earning,
        COALESCE(
            (
                SELECT
                    SUM(payment_amount)
                FROM
                    payments sub
                WHERE
                    sub.vendor_id = p.vendor_id
                    AND sub.payment_status = 'Pending'
            ), 0) AS pending_amount,
        COALESCE(
            (
                SELECT
                    SUM(payment_amount)
                FROM
                    payments sub
                WHERE
                    sub.vendor_id = p.vendor_id
                    AND sub.payment_status = 'Withdrawn'
            ), 0) AS withdrawn_amount
    FROM
        payments p
    WHERE
        p.vendor_id = $1;

      `;

    // Execute the query with the provided vendor_id
    const result = await pool.query(query, [vendor_id]);

    // Send the result as JSON response
    res.json(result.rows); // Assuming there's only one row for the vendor
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define the route to fetch withdrawals by vendor_id
app.get("/withdrawals/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;

  try {
    // Use a SQL query to fetch withdrawals for the specified vendor_id
    const query = "SELECT * FROM withdrawals WHERE vendor_id = $1";
    const values = [vendor_id];
    const { rows } = await pool.query(query, values);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Aditi added

// Add Payment Transaction
app.post("/payment-transactions", async (req, res) => {
  try {
    // Extract payment transaction data from the request body
    const {
      transaction_id,
      order_id,
      payment_date,
      amount,
      currency,
      payment_method,
    } = req.body;

    // Insert the new payment transaction into the PaymentTransactions table
    const insertPaymentTransactionQuery = `
      INSERT INTO paymenttransactions (transaction_id, order_id, payment_date, amount, currency, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      transaction_id,
      order_id,
      payment_date || new Date(),
      amount,
      currency,
      payment_method,
    ];

    // Execute the SQL query to add the payment transaction
    const result = await pool.query(insertPaymentTransactionQuery, values);

    if (result.rowCount === 1) {
      res.status(201).json({
        message: "Payment transaction recorded successfully",
        payment_transaction: result.rows[0],
      });
    } else {
      res
        .status(500)
        .json({ message: "Failed to record the payment transaction" });
    }
  } catch (error) {
    console.error(
      "Error while adding the payment transaction: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Payment Transactions for Order
app.get("/payment-transactions/order/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;

    // Query the database to retrieve all payment transactions for the specific order
    const getPaymentTransactionsQuery = `
      SELECT * FROM paymenttransactions
      WHERE order_id = $1
    `;

    const result = await pool.query(getPaymentTransactionsQuery, [order_id]);

    if (result.rowCount > 0) {
      const paymentTransactions = result.rows;
      res.status(200).json(paymentTransactions);
    } else {
      res
        .status(404)
        .json({ message: "No payment transactions found for this order" });
    }
  } catch (error) {
    console.error(
      "Error while fetching payment transactions: " + error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
