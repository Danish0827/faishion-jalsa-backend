const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const sendEmail = require("./nodemailer");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// contactus form submission
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Insert form data into a PostgreSQL table
  const insertQuery =
    "INSERT INTO contactus (name, email, subject, message) VALUES ($1, $2, $3, $4)";
  const values = [name, email, subject, message];

  const toEmail = "patiladiti240@gmail.com";
  const htmlContent = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>`;

  await pool
    .query(insertQuery, values)
    .then(() => {
      // Data inserted into the database, now send an email
      sendEmail(toEmail, "Contact Us Form Submission", htmlContent);
      res
        .status(200)
        .json({ success: true, message: "Email sent successfully" });
    })
    .catch((error) => {
      console.error("Error inserting data into the database: " + error);
      res.status(500).json({
        success: false,
        message: "Failed to insert data into the database",
      });
    });
});

// route to get all contact submissions
app.get("/getAllContacts", async (req, res) => {
  try {
    // Query the database to retrieve all contact submissions
    const query = "SELECT * FROM contactus";
    const result = await req.pool.query(query);

    // Send the retrieved data as a response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contact submissions" });
  }
});

module.exports = app;
