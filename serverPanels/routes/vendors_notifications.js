// vendor.js
const express = require("express");
const app = express();
const pool = require("../config"); // Assuming you have a database connection configuration file
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Assuming you have a connection pool to your database
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/vendorNotifications/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  
  try {
    const query = "SELECT * FROM vendors_notifications WHERE vendor_id = $1";

    const { rows } = await pool.query(query, [vendor_id]);
    res.status(200).json(rows);
    console.log(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
