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

// Define a route to accept and console the data
app.post("/SetAttributesValues", async (req, res) => {
    try {
        // Assuming you want to log the data sent in the request body
        const { attributeId, attributeName, attributeValues, vendor_id, type } = req.body;

        if (type === "update") {
            // Implement logic to update the attributes table
            // Example: Assuming you have a PostgreSQL pool named 'pool'
            const updateQuery = `
                UPDATE attributes
                SET attribute_values = $1, attribute_name = $3
                WHERE vendor_id = $2 AND attribute_id = $4;
            `;
            await pool.query(updateQuery, [attributeValues, vendor_id, attributeName, attributeId]);
        } else if (type === "add") {
            // Check if the combination of vendor_id and attribute_name already exists
            const checkQuery = `
                SELECT COUNT(*) AS count
                FROM attributes
                WHERE vendor_id = $1 AND attribute_name = $2;
            `;

            const { rows } = await pool.query(checkQuery, [vendor_id, attributeName]);
            const existingAttributeCount = parseInt(rows[0].count, 10);

            if (existingAttributeCount === 0) {
                // Insert the new attribute if it doesn't exist
                const insertQuery = `
            INSERT INTO attributes (vendor_id, attribute_name, attribute_values)
            VALUES ($1, $2, $3);
          `;
                await pool.query(insertQuery, [vendor_id, attributeName, attributeValues]);
            } else {
                return res.status(400).json({ error: "Attribute with the same name already exists" });
            }
        }

        // Send a response if needed
        res.status(200).json({ message: "Data received and Inserted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/GetAttributesByVendor", async (req, res) => {
    try {
        const { vendor_id } = req.body;

        // Example SQL query to retrieve attributes by vendor_id
        const query = `
            SELECT *
            FROM attributes
            WHERE vendor_id = $1;
        `;

        // Execute the query
        const { rows } = await req.pool.query(query, [vendor_id]);

        // Assuming the data is retrieved successfully, send it as a JSON response
        res.status(200).json({ attributes: rows });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete an attribute by attribute_id
app.post("/DeleteAttribute", async (req, res) => {
    try {
        const { attribute_id } = req.body;

        // Implement the logic to delete the attribute in the database
        const deleteQuery = `
        DELETE FROM attributes
        WHERE attribute_id = $1;
      `;
        await req.pool.query(deleteQuery, [attribute_id]);

        // Send a success response to the frontend
        res.status(200).json({ message: "Attribute deleted successfully" });
    } catch (error) {
        console.error("Error:", error);

        // Send an error response to the frontend
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = app;
