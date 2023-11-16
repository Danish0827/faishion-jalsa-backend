const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const fs = require("fs");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Define an endpoint for receiving the PDF file
app.post("/receiveReportPDF", async (req, res) => {
  try {
    const pdfData = req.body.pdfData; // Assuming you send the PDF data in the request body
    const pdfFileName = `report_${new Date().toISOString()}.pdf`;
    const htmlFileName = `report_${new Date().toISOString()}.html`;

    // Specify the paths where you want to store the PDF and HTML files
    const pdfFilePath = `/uploads/ReportsVendors/${pdfFileName}`;
    const htmlFilePath = `/uploads/ReportsVendors/${htmlFileName}`;

    // Save the PDF file to the server
    fs.writeFileSync(pdfFilePath, pdfData);

    // Create an HTML file with a link to the saved PDF
    const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Report PDF</title>
          </head>
          <body>
            <h1>Report PDF</h1>
            <p><a href="${pdfFileName}" target="_blank">View PDF</a></p>
          </body>
        </html>
      `;

    // Save the HTML file to the server
    fs.writeFileSync(htmlFilePath, htmlContent);

    // You can now store the HTML file path in your database or return it as a response to the client.

    res
      .status(200)
      .json({ message: "PDF received and saved as HTML successfully" });
  } catch (error) {
    console.error("Error receiving and saving PDF as HTML:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
