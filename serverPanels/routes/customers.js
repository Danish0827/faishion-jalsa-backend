const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const sendEmail = require("./nodemailer");
const fs = require("fs/promises"); // For reading the HTML template

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/allCustomers", async (req, res) => {
  try {
    //     const query = `
    //         SELECT customers.*,
    //         COALESCE(followers.total_followers, 0) AS total_followers,
    //         COALESCE(following.total_following, 0) AS total_following
    //         FROM customers
    //         LEFT JOIN (
    //             SELECT follower_id, COUNT(*) AS total_followers
    //             FROM customer_follows
    //             GROUP BY follower_id
    //         ) AS followers ON customers.customer_id = followers.follower_id
    //         LEFT JOIN (
    //             SELECT following_id, COUNT(*) AS total_following
    //             FROM customer_follows
    //             GROUP BY following_id
    //         ) AS following ON customers.customer_id = following.following_id;
    // `;
    const query = `
    SELECT customers.*,
            COALESCE(followers.total_followers, 0) AS total_followers,
            COALESCE(following.total_following, 0) AS total_following,
        COALESCE(orders.total_orders, 0) AS total_orders,
            COALESCE(orders.total_revenue, 0) AS total_revenue
            FROM customers
            LEFT JOIN (
                SELECT follower_id, COUNT(*) AS total_followers
                FROM customer_follows
                GROUP BY follower_id
            ) AS followers ON customers.customer_id = followers.follower_id
            LEFT JOIN (
                SELECT following_id, COUNT(*) AS total_following
                FROM customer_follows
                GROUP BY following_id
            ) AS following ON customers.customer_id = following.following_id
        LEFT JOIN (
          SELECT customer_id, count(*) AS total_orders, sum(total_amount) AS total_revenue
          FROM vendorproductorder
          GROUP BY customer_id
        ) AS orders ON customers.customer_id = orders.customer_id;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addcustomers", async (req, res) => {
  try {
    console.log(req.body);
    const existingEmailQuery = "SELECT email FROM customers WHERE email = $1";
    const existingEmailValues = [req.body.email];

    const min = 1000;
    const max = 9999;
    const verification_code = Math.floor(Math.random() * (max - min + 1)) + min;

    const { rows: existingEmailRows } = await pool.query(
      existingEmailQuery,
      existingEmailValues
    );

    if (existingEmailRows.length > 0) {
      // The email already exists, return a response indicating that
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // If the email is not found, proceed to insert the new customer
    const newCustomer = {
      // Extract customer details from the request body
      given_name: req.body.given_name || "",
      family_name: req.body.family_name || "",
      email: req.body.email || "",
      password: req.body.password || "ShadabKhan1@",
      phone_number: req.body.phone_number || "",
      address_line_1: req.body.address_line_1 || "",
      address_line_2: req.body.address_line_2 || "",
      city: req.body.city || "",
      state: req.body.state || "",
      zip_code: req.body.zip_code || "",
      country: req.body.country || "",
      bio: req.body.bio || "",
      status: req.body.status || 0,
    };

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(newCustomer?.password, 10);

    // Insert the new customer into the "customers" table
    const insertCustomerQuery = `
        INSERT INTO customers
        (given_name, family_name, email, phone_number, address_line_1, address_line_2, city, state, zip_code, country, bio, status, password, verification_code, verification_expire_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING customer_id;
      `;

    // Calculate the verification expiration date (current_date + 30 minutes)
    const verificationExpireDate = new Date();
    verificationExpireDate.setMinutes(verificationExpireDate.getMinutes() + 30);

    const insertCustomerValues = [
      newCustomer.given_name,
      newCustomer.family_name,
      newCustomer.email,
      newCustomer.phone_number,
      newCustomer.address_line_1,
      newCustomer.address_line_2,
      newCustomer.city,
      newCustomer.state,
      newCustomer.zip_code,
      newCustomer.country,
      newCustomer.bio,
      newCustomer.status,
      hashedPassword, // Store the hashed password
      verification_code,
      verificationExpireDate,
    ];

    const { rows } = await pool.query(
      insertCustomerQuery,
      insertCustomerValues
    );

    const insertedCustomerId = rows[0].customer_id;

    // Replace placeholders with actual values
    const user_name = newCustomer.given_name || ""; // Use the customer's name

    // Read the HTML email template
    const htmlTemplate = await fs.readFile(
      "./htmlTemplates/verification_email_template.html",
      "utf-8"
    );

    const htmlContent = htmlTemplate
      .replace(/\[user_name\]/g, user_name)
      .replace(/\[verification_code\]/g, verification_code);

    // Send the verification email
    await sendEmail(newCustomer.email, "Email Verification", htmlContent);

    res.status(201).json({
      success: true,
      message:
        "Account Created Successfully. A verification email has been sent. Please check your inbox.",
      insertedId: insertedCustomerId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the customer",
    });
  }
});

const generateRandomNumber = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let result = "";

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

app.post("/customerLoginEmail", async (req, res) => {
  const { email, password } = req.body;
  const loggedid = generateRandomNumber();

  try {
    // Query the database to find a customer with the provided email
    const query = "SELECT * FROM customers WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      // If no customer with the email is found, send a response
      return res.status(401).json({ message: "Account doesn't exist" });
    }

    // Check if google_id is not null
    if (rows[0].google_id !== null) {
      // If google_id is not null, send a response saying "Kindly Login with Google"
      return res.status(401).json({
        message: "This account needs to be logged in with Google",
      });
    }

    // Compare the provided password with the hashed password from the database
    const hashedPassword = rows[0].password; // Assuming your password column is named "password"
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      // If the passwords don't match, send an authentication error response
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Check if the account is verified (you may have a verification flag in your database)
    if (rows[0].status === 0) {
      // If the account is not verified, you can send a response asking the user to verify their account
      // You can also trigger a verification email here
      const otp = Math.floor(1000 + Math.random() * 9000);
      const verificationExpireDate = new Date();
      verificationExpireDate.setMinutes(
        verificationExpireDate.getMinutes() + 30
      ); // Set expiration to 30 minutes from now

      // Construct the email content
      const toEmail = rows[0].email; // Get the user's email from the database
      const subject = "Account Verification";
      const htmlContent = `
          <p>Hello, ${rows[0].given_name} ${rows[0].family_name}</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>If you did not request this verification, please ignore this email.</p>
        `;

      const query = `
      UPDATE customers
      SET verification_code = $1, verification_expire_date = $2
      WHERE customer_id = $3;
    `;

      // Execute the SQL query with parameters
      await pool.query(query, [
        otp,
        verificationExpireDate,
        rows[0].customer_id,
      ]);
      // Call the sendMail function to send the email
      sendEmail(toEmail, subject, htmlContent)
        .then(() => {
          // If the email is sent successfully, return a response to the user
          return res.status(401).json({
            status: 301,
            user: rows[0],
            message:
              "Account not verified. An email with verification instructions has been sent to your Gmail account. Please check your Gmail inbox and follow the instructions to verify your account.",
          });
        })
        .catch((error) => {
          // If there's an error sending the email, handle it appropriately
          console.error("Error sending verification email:", error);
          return res.status(500).json({
            status: 500,
            message: "Internal server error. Please try again later.",
          });
        });
    } else {
      // Update the customer_loggedid in the database
      await req.pool.query(
        'UPDATE customers SET "customer_loggedid" = $1 WHERE email = $2',
        [loggedid, email]
      );

      const updatedQuery = "SELECT * FROM customers WHERE email = $1";
      const { rows: updatedRows } = await pool.query(updatedQuery, [email]);

      const customerData = { ...updatedRows[0] };
      delete customerData.password;

      // For now, let's send a success response
      res.json({ message: "Login successful", loggedid, customerData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/verifyVerificationCodeCustomer", async (req, res) => {
  try {
    const { CustomerId, verificationCode } = req.body;

    // Check if the verification code exists and is not expired
    const query = `
      SELECT verification_expire_date
      FROM customers
      WHERE customer_id = $1 AND verification_code = $2
    `;

    const { rows } = await pool.query(query, [CustomerId, verificationCode]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    const verificationExpireDate = new Date(rows[0].verification_expire_date);
    const currentTime = new Date();

    if (verificationExpireDate <= currentTime) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    // If code is valid and not expired, you can mark it as verified in your database

    // Update the customer's verification status in your database
    const updateQuery = `
      UPDATE customers
      SET status = 1
      WHERE customer_id = $1
    `;

    await pool.query(updateQuery, [CustomerId]);

    return res.status(200).json({
      message: "Verification successful.",
      isConfirmed: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
});

app.post("/updatecustomer", async (req, res) => {
  try {
    const selectedKey = req.body.selectedKey;

    const updatedCustomer = {
      given_name: req.body.values.given_name,
      family_name: req.body.values.family_name,
      email: req.body.values.email,
      phone_number: req.body.values.phone_number,
      address_line_1: req.body.values.address_line_1,
      address_line_2: req.body.values.address_line_2,
      city: req.body.values.city,
      state: req.body.values.state,
      zip_code: req.body.values.zip_code,
      country: req.body.values.country,
      bio: req.body.values.bio,
      status: req.body.values.status,
    };

    // Update the customer in the "customers" table
    const updateCustomerQuery = `
            UPDATE customers
            SET given_name = $1, family_name = $2, email = $3, phone_number = $4, address_line_1 = $5,
                address_line_2 = $6, city = $7, state = $8, zip_code = $9, country = $10, bio = $11,
                status = $12, updated_at = NOW()
            WHERE customer_id = $13;
        `;

    const updateCustomerValues = [
      updatedCustomer.given_name,
      updatedCustomer.family_name,
      updatedCustomer.email,
      updatedCustomer.phone_number,
      updatedCustomer.address_line_1,
      updatedCustomer.address_line_2,
      updatedCustomer.city,
      updatedCustomer.state,
      updatedCustomer.zip_code,
      updatedCustomer.country,
      updatedCustomer.bio,
      updatedCustomer.status,
      selectedKey, // customer_id for the WHERE clause
    ];

    await pool.query(updateCustomerQuery, updateCustomerValues);

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the customer" });
  }
});

app.post("/getCustomerLoginData", async (req, res) => {
  try {
    const loggedId = req.body.customerLoginCookies; // Assuming the loggedId value is sent in the request body
    const query = 'SELECT * FROM customers WHERE "customer_loggedid" = $1';
    const values = [loggedId];

    const { rows } = await pool.query(query, values);
    console.log(req.body);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle file upload
// img storage path
const imgconfigCustomers = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/customerProfileImages");
  },
  filename: (req, file, callback) => {
    callback(null, `Customer-Profile-${Date.now()} - ${file.originalname}`);
  },
});

// img filter
const isCustomerImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadCustomerImage = multer({
  storage: imgconfigCustomers,
  fileFilter: isCustomerImage,
});

app.post(
  "/uploadCustomerProfileImage",
  uploadCustomerImage.single("picture"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No image file provided." });
        return;
      }

      // Assuming you have a customerId in the request body
      const { key } = req.body;
      console.log(key);
      // Update the customer's profile picture URL in the database with the new image URL
      const updateQuery = `
        UPDATE customers
        SET picture = $1
        WHERE customer_id = $2
      `;
      await pool.query(updateQuery, [file.filename, key]);

      // Send the image URL as a response to the frontend
      res.status(200).json({ picture: file.filename });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error occurred while storing the profile picture." });
    }
  }
);

app.post("/removeCustomerProfileImage", async (req, res) => {
  try {
    const { key } = req.body;
    // Update the customer's picture field to null in the database
    const queryText =
      "UPDATE customers SET picture = NULL WHERE customer_id = $1";
    await pool.query(queryText, [key]);
    return res.json({
      message: "Profile photo has been removed successfully.",
    });
  } catch (error) {
    console.error("Error while removing profile photo:", error);
    return res.status(500).json({ message: "Failed to remove profile photo." });
  }
});

// delete a customer - Admin
app.post("/deleteCustomer", async (req, res) => {
  try {
    const customer_id = req.body.selectedKey;

    // Check if the customer with the given ID exists in the database
    const checkQuery = "SELECT * FROM customers WHERE customer_id = $1";
    const checkValues = [customer_id];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Customer with the given ID does not exist
      return res.status(404).json({ error: "Customer not found." });
    }

    // If the customer exists, proceed with the deletion
    const deleteCustomerQuery = "DELETE FROM customers WHERE customer_id = $1";
    await pool.query(deleteCustomerQuery, [customer_id]);

    res.status(204).end(); // Return 204 No Content status to indicate successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get customer orders
app.post("/getCustomerOrders", async (req, res) => {
  try {
    const customer_id = req.body.selectedKey;
    const selectQuery =
      "SELECT * FROM vendorproductorder WHERE customer_id = $1 ORDER BY order_id DESC";
    const selectValue = [customer_id];

    const { rows } = await pool.query(selectQuery, selectValue);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/addCustomerSupportTicket", async (req, res) => {
//   try {
//     const { subject, message, attachments, customer_id } = req.body;
//     const status = "Open";

//     const insertquery = `INSERT INTO support_ticket(subject, status, customer_id) VALUES ($1, $2, $3) RETURNING *`;
//     const insertvalues = [subject, status, customer_id];

//     const insertresult = await pool.query(insertquery, insertvalues);

//     const ticket_id = insertresult.rows[0]?.ticket_id;

//     const insertmessagequery = `INSERT INTO support_ticket_messages(ticket_id, customer_id, message, attachments) VALUES
//     ($1, $2, $3, $4::jsonb) RETURNING *`;
//     const insertmessagevalues = [
//       ticket_id,
//       customer_id,
//       message,
//       JSON.stringify(attachments),
//     ];

//     const insertmessageresult = await pool.query(
//       insertmessagequery,
//       insertmessagevalues
//     );

//     console.log(insertresult.rows[0]);
//     console.log(insertmessageresult.rows[0]);

//     const response = {
//       ...insertmessageresult.rows[0],
//       subject: subject,
//       status: status,
//     };

//     res.status(200).json({
//       status: 200,
//       message: "New Support Ticket created successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error creating support ticket:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// });

// create a new customer support ticket - Customer
app.post(
  "/addCustomerSupportTicket",
  uploadCustomerImage.array("attachments", 5),
  async (req, res) => {
    try {
      const { subject, message, customer_id } = req.body;
      const status = "Open";

      const insertquery = `INSERT INTO support_ticket(subject, status, customer_id) VALUES ($1, $2, $3) RETURNING *`;
      const insertvalues = [subject, status, customer_id];

      const insertresult = await pool.query(insertquery, insertvalues);

      const ticket_id = insertresult.rows[0]?.ticket_id;

      // Retrieve file paths from the uploaded files
      const attachmentPaths = req.files.map((file) => file.path);

      const insertmessagequery = `INSERT INTO support_ticket_messages(ticket_id, customer_id, message, attachments) VALUES 
    ($1, $2, $3, $4::jsonb) RETURNING *`;
      const insertmessagevalues = [
        ticket_id,
        customer_id,
        message,
        JSON.stringify(attachmentPaths), // Store file paths as an array
      ];

      const insertmessageresult = await pool.query(
        insertmessagequery,
        insertmessagevalues
      );

      console.log(insertresult.rows[0]);
      console.log(insertmessageresult.rows[0]);

      const response = {
        ...insertmessageresult.rows[0],
        subject: subject,
        status: status,
      };

      res.status(200).json({
        status: 200,
        message: "New Support Ticket created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
);

// app.post("/addMessageToSupportTicket", async (req, res) => {
//   try {
//     const { ticket_id, customer_id, message, attachments, status } = req.body;
//     console.log(req.body);

//     // Check if the ticket exists and is open or in progress (you may add more validation as needed)
//     const ticketQuery =
//       "SELECT status, subject FROM support_ticket WHERE ticket_id = $1";
//     const ticketStatus = await pool.query(ticketQuery, [ticket_id]);

//     if (
//       !ticketStatus.rows[0] ||
//       (ticketStatus.rows[0].status !== "Open" &&
//         ticketStatus.rows[0].status !== "In Progress")
//     ) {
//       return res.status(400).json({
//         status: 400,
//         message: "Invalid or closed ticket",
//       });
//     }

//     // Update the status if it's "Closed"
//     if (status == "Closed" || status == "In Progress") {
//       const updateStatusQuery =
//         "UPDATE support_ticket SET status = $1 WHERE ticket_id = $2";
//       await pool.query(updateStatusQuery, [status, ticket_id]);
//     }

//     // Insert the new message
//     const insertMessageQuery = `INSERT INTO support_ticket_messages (ticket_id, customer_id, message, attachments) VALUES
//     ($1, $2, $3, $4::jsonb) RETURNING *`;

//     const insertMessageValues = [
//       ticket_id,
//       customer_id,
//       message,
//       JSON.stringify(attachments),
//     ];

//     const insertMessageResult = await pool.query(
//       insertMessageQuery,
//       insertMessageValues
//     );

//     const response = {
//       ...insertMessageResult.rows[0],
//       status: status,
//       subject: ticketStatus.rows[0].subject,
//     };

//     res.status(200).json({
//       status: 200,
//       message: "New message added to the support ticket",
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error adding a message to the support ticket:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// });

// add a new message for a support ticket - Customer & Admin both
app.post(
  "/addMessageToSupportTicket",
  uploadCustomerImage.array("attachments", 5),
  async (req, res) => {
    try {
      const { ticket_id, customer_id, message, status } = req.body; // Remove attachments
      console.log(req.body);

      // Check if the ticket exists and is open or in progress (you may add more validation as needed)
      const ticketQuery =
        "SELECT status, subject FROM support_ticket WHERE ticket_id = $1";
      const ticketStatus = await pool.query(ticketQuery, [ticket_id]);

      if (
        !ticketStatus.rows[0] ||
        (ticketStatus.rows[0].status !== "Open" &&
          ticketStatus.rows[0].status !== "In Progress")
      ) {
        return res.status(400).json({
          status: 400,
          message: "Invalid or closed ticket",
        });
      }

      // Update the status if it's "Closed" or "In Progress"
      if (status === "Closed" || status === "In Progress") {
        const updateStatusQuery =
          "UPDATE support_ticket SET status = $1 WHERE ticket_id = $2";
        await pool.query(updateStatusQuery, [status, ticket_id]);
      }

      // Retrieve file paths from the uploaded files
      const attachmentPaths = req.files.map((file) => file.path);

      // Insert the new message with attachments
      const insertMessageQuery = `INSERT INTO support_ticket_messages (ticket_id, customer_id, message, attachments) VALUES 
    ($1, $2, $3, $4::jsonb) RETURNING *`;

      const insertMessageValues = [
        ticket_id,
        customer_id || null,
        message,
        JSON.stringify(attachmentPaths), // Store file paths as an array
      ];

      const insertMessageResult = await pool.query(
        insertMessageQuery,
        insertMessageValues
      );

      const response = {
        ...insertMessageResult.rows[0],
        status: status,
        subject: ticketStatus.rows[0].subject,
      };

      res.status(200).json({
        status: 200,
        message: "New message added to the support ticket",
        data: response,
      });
    } catch (error) {
      console.error("Error adding a message to the support ticket:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
);

// get support ticket and its messages for a particular customer
app.get(
  "/getSupportTicketsAndMessagesForCustomer/:customer_id",
  async (req, res) => {
    try {
      const { customer_id } = req.params;

      const query = `
      SELECT s.ticket_id, s.subject, s.status, t.message_id, t.customer_id, t.message, t.attachments, t.timestamp
      FROM support_ticket AS s
      JOIN support_ticket_messages AS t ON s.ticket_id = t.ticket_id
      WHERE t.customer_id = $1
         OR (t.customer_id IS NULL AND s.ticket_id IN (
             SELECT ticket_id
             FROM support_ticket
             WHERE customer_id = $1
           ))
      GROUP BY s.ticket_id, t.message_id
      ORDER BY t.timestamp;
    `;

      const result = await pool.query(query, [customer_id]);

      res.status(200).json({
        status: 200,
        message: "Support Tickets and Messages retrieved successfully",
        data: result.rows,
      });
    } catch (error) {
      console.error("Error retrieving support tickets and messages:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
);

// get all support tickets - Admin
app.get("/getAllSupportTicketsAndMessages", async (req, res) => {
  try {
    const query = `
      SELECT s.ticket_id, s.subject, s.status, t.message_id, t.customer_id, t.message, t.attachments, t.timestamp
      FROM support_ticket AS s
      JOIN support_ticket_messages AS t ON s.ticket_id = t.ticket_id
      GROUP BY s.ticket_id, t.message_id
      ORDER BY t.timestamp;
    `;

    const result = await pool.query(query);

    res.status(200).json({
      status: 200,
      message: "All Support Tickets and Messages retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving all support tickets and messages:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

module.exports = app;
