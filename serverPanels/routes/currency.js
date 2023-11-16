const express = require("express");
const app = express();
const pool = require("../config");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cheerio = require("cheerio");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Add a new currency rate
app.post("/currency_rates", async (req, res) => {
  const { from_currency, to_currency, exchange_rate, markup_percentage } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO currency_rates (from_currency, to_currency, exchange_rate, markup_percentage) VALUES ($1, $2, $3, $4) RETURNING *",
      [from_currency, to_currency, exchange_rate, markup_percentage]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
