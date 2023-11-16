const express = require("express");
const app = express();
const pool = require("./config");
const port = 3001;
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieSession = require("cookie-session");
const passportSetup = require("./routes/passport");
const passport = require("passport");
const authRoute = require("./routes/auth");

const vendorRoute = require("./routes/vendor");
const categoryRoute = require("./routes/category");
const subcategoryRoute = require("./routes/subcategory");
const customersRoute = require("./routes/customers");
const ordersRoute = require("./routes/orders");
const paymentRoute = require("./routes/payments");
const vendorNotifications = require("./routes/vendors_notifications");
const shipping = require("./routes/shipping");
const reports = require("./routes/reports");
const attributes = require("./routes/attributes");
const cart = require("./routes/cart");
const products = require("./routes/products");
const contactus = require("./routes/contactus");
const wishlist = require("./routes/wishlist")
const order = require("./routes/order")
const sendEmail = require("./routes/nodemailer");
const currency = require("./routes/currency")

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Use the vendor routes
app.use("/api", vendorRoute);
app.use("/api", categoryRoute);
app.use("/api", subcategoryRoute);
app.use("/api", customersRoute);
app.use("/api", ordersRoute);
app.use("/api", paymentRoute);
app.use("/api", vendorNotifications);
app.use("/api", shipping);
app.use("/api", reports);
app.use("/api", attributes);
app.use("/api", cart);
app.use("/api", products);
app.use("/api", contactus);
app.use("/api", wishlist)
app.use("/api", order)
app.use("/api", currency)

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Check if the table exists
const checkTableExists = async () => {
  const tableExistsQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'vendors'
      )
    `;

  const result = await pool.query(tableExistsQuery);
  return result.rows[0].exists;
};

// Create the table if it doesn't exist
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE vendors (
      id SERIAL PRIMARY KEY,
      country_code VARCHAR(10) NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      brand_logo VARCHAR(255),
      brand_name VARCHAR(255),
      business_model VARCHAR(255),
      products JSONB,
      trademark_certificate BYTEA,
      company_name VARCHAR(255),
      company_address TEXT,
      company_city VARCHAR(255),
      company_state VARCHAR(255),
      company_country VARCHAR(255),
      company_zip_code VARCHAR(20),
      shipping_address JSONB,
      bank_name VARCHAR(255),
      bank_account_number VARCHAR(50),
      bank_routing_number VARCHAR(50),
      bank_account_name VARCHAR(255),
      bank_branch VARCHAR(255),
      bank_swift_code VARCHAR(50),
      registration_date VARCHAR(255),
      mobile_verification_status BOOLEAN,
      email_verification_status BOOLEAN
    )
  `;

  await pool.query(createTableQuery);
};

app.post("/api/superadminLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Use the connection pool to check if the email exists in the database
    const loggedId = generateRandomNumber(); // Generate a 28-character random string
    const result = await req.pool.query(
      "SELECT * FROM superadmin WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const superAdminLogin = result.rows[0];
      const hashedPassword = superAdminLogin.password; // Assuming the hashed password is stored in the 'password' field

      // Compare the hashed password with the input password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, generate random string
        // Update the 'loggedId' column with the generated random string
        await req.pool.query(
          'UPDATE superadmin SET "userId" = $1 WHERE email = $2',
          [loggedId, email]
        );

        // Return the updated superadmin data
        res
          .status(200)
          .send({ status: 200, data: { ...superAdminLogin, loggedId } });
      } else {
        // Passwords do not match
        res.status(400).send({ status: 400, message: "Invalid Password..." });
      }
    } else {
      res.status(400).send({ status: 400, message: "Email does not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/api/getAdminData", async (req, res) => {
  try {
    const loggedId = req.body.loggedId; // Assuming the loggedId value is sent in the request body

    const query = 'SELECT * FROM superadmin WHERE "userId" = $1';
    const values = [loggedId];

    const { rows } = await pool.query(query, values);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Adding Staff to Admin Table to assign roles
app.post("/api/addStaffDetailstoAdmin", async (req, res) => {
  try {
    const { email, name, password } = req.body.values;
    const selectedPosition = req.body.selectedPosition;
    const selectedLinkIds = req.body.selectedLinkIds;

    // const password = "Shadabkhan1@";
    // Check if the email exists in the superadmin table
    const emailCheckQuery = "SELECT COUNT(*) FROM superadmin WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    const emailExists = emailCheckResult.rows[0].count > 0;

    if (emailExists) {
      return res.status(200).json({
        status: 409,
        message: "Email already exists in the superadmin table",
      });
    }

    // Construct the email content
    const toEmail = email; // Get the user's email from the database
    const subject = `Welcome to Fashion Jalsa - Your New ${selectedPosition} Account Details`;
    const htmlContent = `
      Dear ${name},
      <br><br>
      We are excited to welcome you to Fashion Jalsa! You have been added as a new ${selectedPosition} member in our Admin panel, and we are pleased to have you on board.
      <br><br>
      Here are your account details:
      <ul>
      <li><strong>Username/Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
      </ul>
      <br>
      Please log in to your account using the provided credentials. 
      <br><br>
      With your new ${selectedPosition} account, you have been assigned some roles that grant you access to specific areas and functionalities within our organization. Please familiarize yourself with your responsibilities and the permissions associated with your roles.
      <br><br>
      If you have any questions, encounter any issues during login, or need assistance with your assigned roles, please don't hesitate to reach out to our support team at [Support Email Address]. We are here to help you get started and ensure a smooth transition into your new role.
      <br><br>
      Once again, welcome to the Fashion Jalsa team! We look forward to working together and achieving great success.
      <br><br>
      Best regards,
      <br>
      Admin<br>
      Fashion Jalsa<br>
      [Contact Information]`;

    // Hash the password before storing it
    const saltRounds = 10; // The higher the value, the more secure, but slower
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      // If the email does not exist, store the data in the superadmin table
      const insertQuery =
        "INSERT INTO superadmin (email,  password, position, role_id, name) VALUES ($1, $2, $3, $4, $5)";
      await pool.query(insertQuery, [
        email,
        hash,
        selectedPosition,
        selectedLinkIds,
        name,
      ]);

      // Send the email to new staff
      await sendEmail(toEmail, subject, htmlContent);

      res.status(200).json({
        status: 200,
        message:
          "Staff details have been successfully added to the superadmin table, and an email notification has been sent to the new staff member.",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Updating the staff roles
app.post("/api/updateSuperAdminRoles", async (req, res) => {
  const selectedLinkIds = req.body.selectedLinkIds;
  const selectedPosition = req.body.selectedPosition;
  const id = req.body.selectedKey;
  const { email, name } = req.body.values;

  // Construct the email content
  const toEmail = email; // Get the user's email from the database
  const subject = `Fashion Jalsa - Role and Permissions Update`;
  const htmlContent = `
    Dear ${name},
    <br><br>
    We want to inform you that there has been an update to your position & role within Fashion Jalsa. Your position ${selectedPosition} include updated roles.    
    <br><br>
    To review your updated role, please log in to the admin panel using your existing credentials. You can access the admin panel at [Admin Panel URL].
    <br><br>
    If you have any questions or encounter any issues while accessing your updated permissions, please don't hesitate to contact us at [Support Email Address]. We are here to assist you.
    <br><br>
    Thank you for your continued contributions to Fashion Jalsa.
    <br><br>
    Best regards,
    <br>
    Admin<br>
    Fashion Jalsa<br>
    [Contact Information]`;

  try {
    // Update the 'roles' column in the 'superadmin' table using the selectedLinkIds
    const query =
      "UPDATE superadmin SET name=$5, email=$4, role_id = $1, position = $3 WHERE id = $2";
    await pool.query(query, [
      selectedLinkIds,
      id,
      selectedPosition,
      email,
      name,
    ]);

    // Send the email to updated staff
    await sendEmail(toEmail, subject, htmlContent);

    // Send a response back to the frontend
    res
      .status(200)
      .json({ status: 200, message: "Roles updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Deleting the staff
app.post("/api/deleteSellerAdmin", async (req, res) => {
  try {
    const { selectedKey, name, email, position } = req.body;

    // Construct the email content
    const toEmail = email; // Get the user's email from the database
    const subject = `Fashion Jalsa - Account Deletion Confirmation`;
    const htmlContent = `
    Dear ${name},
    <br><br>
    We hope this message finds you well. We regret to inform you that your account with Fashion Jalsa has been deleted as per your request or due to specific circumstances.
    <br><br>
    Account Information:
    <ul>
    <li><strong>Username/Email:</strong> ${email}</li>
    <li><strong>Role Position:</strong> ${position}</li>
    <li><strong>Account Deletion Date:</strong> ${new Date()}</li>
    </ul>
    <br>
    Please be aware that your access to our platform or services has been terminated, and your account data has been permanently removed from our systems.
    <br><br>
    If you believe this account deletion was in error or have any concerns related to the deletion, please contact our support team immediately at [Support Email Address]. We will be happy to assist you in resolving any issues or concerns you may have.
    <br><br>
    Thank you for your past engagement with Fashion Jalsa, and we hope to assist you in the future if the need arises.
    <br><br>
    Best regards,
    <br>
    Admin<br>
    Fashion Jalsa<br>
    [Contact Information]`;

    // Execute the delete query
    const query = "DELETE FROM superadmin WHERE id = $1";
    await pool.query(query, [selectedKey]);

    // Send the email to deleted staff
    await sendEmail(toEmail, subject, htmlContent);

    // Send a successful response
    res
      .status(200)
      .json({ status: 200, message: "Item deleted successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error while deleting data:", error);
    res.status(500).json({ status: 500, error: "Failed to delete the item." });
  }
});

// GET ALL STAFF CREATED BY ADMIN
app.get("/api/allStaff", async (req, res) => {
  try {
    const query = "SELECT * FROM superadmin";
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add Vendor Details
app.post("/api/addVendorstoDb", async (req, res) => {
  try {
    const { country_code, mobile_number, email, vendorname } = req.body;

    // Check if the table exists
    const tableExists = await checkTableExists();
    // Create the table if it doesn't exist
    if (!tableExists) {
      await createTable();
    }
    // Check if email already exists
    const emailExistsQuery = "SELECT * FROM vendors WHERE email = $1";
    const emailExistsResult = await pool.query(emailExistsQuery, [email]);

    if (emailExistsResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // Generate a password
    const password = "ShadabKhan1@";
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Get the current date
    const currentDate = moment().format("MMMM Do YYYY, h:mm:ss a");
    // Generate email OTP
    const email_otp = Math.floor(1000 + Math.random() * 9000);
    // Generate mobile OTP
    const mobile_otp = Math.floor(1000 + Math.random() * 9000);
    // Store the data in PostgreSQL with status set to false and current date
    const insertQuery =
      "INSERT INTO vendors (country_code, mobile_number, email, vendorname, password, registration_date, mobile_verification_status, email_verification_status, email_otp, mobile_otp) VALUES ($1, $2, $3, $4, $5, $6, false, false, $7, $8) RETURNING id";
    const result = await pool.query(insertQuery, [
      country_code,
      mobile_number,
      email,
      vendorname,
      hashedPassword,
      currentDate,
      email_otp,
      mobile_otp,
    ]);
    const lastInsertedId = result.rows[0].id;
    res
      .status(200)
      .json({ message: "Vendor added successfully", lastInsertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add Vendor Details from Vendor Panel
app.post("/api/addVendorstoDbByVendor", async (req, res) => {
  try {
    const { country_code, mobile_number, email, vendorname, password } =
      req.body;

    // Check if the table exists
    const tableExists = await checkTableExists();
    // Create the table if it doesn't exist
    if (!tableExists) {
      await createTable();
    }
    // Check if email already exists
    const emailExistsQuery = "SELECT * FROM vendors WHERE email = $1";
    const emailExistsResult = await pool.query(emailExistsQuery, [email]);

    if (emailExistsResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Get the current date
    const currentDate = moment().format("MMMM Do YYYY, h:mm:ss a");
    // Generate email OTP
    const email_otp = Math.floor(1000 + Math.random() * 9000);
    // Generate mobile OTP
    const mobile_otp = Math.floor(1000 + Math.random() * 9000);
    // Store the data in PostgreSQL with status set to false and current date
    const insertQuery =
      "INSERT INTO vendors (country_code, mobile_number, email, vendorname, password, registration_date, mobile_verification_status, email_verification_status, email_otp, mobile_otp) VALUES ($1, $2, $3, $4, $5, $6, false, false, $7, $8) RETURNING id";
    const result = await pool.query(insertQuery, [
      country_code,
      mobile_number,
      email,
      vendorname,
      hashedPassword,
      currentDate,
      email_otp,
      mobile_otp,
    ]);
    const lastInsertedId = result.rows[0].id;
    res
      .status(200)
      .json({ message: "Vendor added successfully", lastInsertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Vendors Details
app.post("/api/updateVendorDb", async (req, res) => {
  try {
    const { selectedKey } = req.body;
    const {
      country_code,
      mobile_number,
      email,
      vendorname,
      brand_name,
      business_model,
      bank_name,
      bank_account_number,
      bank_routing_number,
      bank_account_name,
      bank_branch,
      bank_swift_code,
    } = req.body.values;

    const client = await pool.connect();
    const updateParams = [];

    let updateQuery = `
        UPDATE vendors
        SET 
      `;

    if (country_code != null || country_code != undefined) {
      updateQuery += " country_code = $" + updateParams.push(country_code);
    }

    if (mobile_number != null || mobile_number != undefined) {
      updateQuery += ", mobile_number = $" + updateParams.push(mobile_number);
    }

    if (email != null || email != undefined) {
      updateQuery += ", email = $" + updateParams.push(email);
    }

    if (vendorname != null || vendorname != undefined) {
      updateQuery += ", vendorname = $" + updateParams.push(vendorname);
    }

    if (brand_name != null || brand_name != undefined) {
      updateQuery += " brand_name = $" + updateParams.push(brand_name);
    }

    if (business_model != null || business_model != undefined) {
      updateQuery += ", business_model = $" + updateParams.push(business_model);
    }

    if (bank_name != null || bank_name != undefined) {
      updateQuery += " bank_name = $" + updateParams.push(bank_name);
    }

    if (bank_account_number != null || bank_account_number != undefined) {
      updateQuery +=
        ", bank_account_number = $" + updateParams.push(bank_account_number);
    }

    if (bank_routing_number != null || bank_routing_number != undefined) {
      updateQuery +=
        ", bank_routing_number = $" + updateParams.push(bank_routing_number);
    }

    if (bank_account_name != null || bank_account_name != undefined) {
      updateQuery +=
        ", bank_account_name = $" + updateParams.push(bank_account_name);
    }

    if (bank_branch != null || bank_branch != undefined) {
      updateQuery += ", bank_branch = $" + updateParams.push(bank_branch);
    }

    if (bank_swift_code != null || bank_swift_code != undefined) {
      updateQuery +=
        ", bank_swift_code = $" + updateParams.push(bank_swift_code);
    }

    updateQuery += " WHERE id = $" + updateParams.push(selectedKey);

    await client.query(updateQuery, updateParams);
    client.release();

    res.status(200).json({ message: "Vendor data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update vendor details (from vendor panel)
app.post("/api/updateVendorDbByVendor", async (req, res) => {
  try {
    const { selectedKey } = req.body;
    const updateParams = [];
    let updateQuery = `
        UPDATE vendors
        SET`;

    const updateValues = req.body.values;

    for (const key in updateValues) {
      if (updateValues.hasOwnProperty(key)) {
        updateQuery += ` ${key} = $${updateParams.push(updateValues[key])},`;
      }
    }

    // Remove the trailing comma
    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE id = $" + updateParams.push(selectedKey);

    const client = await pool.connect();
    await client.query(updateQuery, updateParams);
    client.release();

    res.status(200).json({ message: "Vendor data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/allVendors", async (req, res) => {
  try {
    const getAllVendorsQuery = "SELECT * FROM vendors";
    const result = await pool.query(getAllVendorsQuery);

    const vendors = result.rows;
    res.status(200).json({ vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle file upload
// img storage path
const imgconfigVendors = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/vendorsProductImages");
  },
  filename: (req, file, callback) => {
    callback(null, `Vendor-Product-${Date.now()} - ${file.originalname}`);
  },
});

// img filter
const isVendorImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};

const uploadVendorImage = multer({
  storage: imgconfigVendors,
  fileFilter: isVendorImage,
});

app.post(
  "/api/uploadVendorDocImage",
  uploadVendorImage.array("images"),
  async (req, res) => {
    const files = req.files;
    const imageUrls = [];
    // Iterate through the uploaded files and save the image URLs
    for (const file of files) {
      const imageUrl = `${file.filename}`;
      imageUrls.push(imageUrl);
    }
    try {
      let { ids } = req.body; // Assuming you have a productId in the request body

      // Convert ids to an array if it's not already an array
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      // Convert ids to an array of numbers
      const idNumbers = ids.map(Number);

      // Retrieve the existing products column for the vendor
      const selectQuery = `
        SELECT products
        FROM vendors
        WHERE id = ANY ($1::int[])
      `;
      const selectResult = await pool.query(selectQuery, [idNumbers]);

      // Get the existing products JSONB object or initialize an empty object if it doesn't exist
      const existingProducts = selectResult.rows[0]?.products || {};

      // Retrieve the existing images array from the products JSONB object
      const existingImages = existingProducts.images || [];

      // Append the user-uploaded image URLs to the existing images array
      const updatedImages = [...existingImages, ...imageUrls];

      // Update the products JSONB object with the updated images array
      const updatedProducts = {
        ...existingProducts,
        images: updatedImages,
      };

      console.log(updatedProducts); // Log the updatedProducts object to check the value

      // Update the vendors table with the updated products JSONB object
      const updateQuery = `
        UPDATE vendors
        SET products = $1
        WHERE id = ANY ($2::int[])
      `;
      await pool.query(updateQuery, [updatedProducts, idNumbers]);

      // Send the image URLs as a response to the frontend
      res.status(200).json({ imageUrls, idNumbers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error occurred while storing the image URLs." });
    }
  }
);

// Delete Vendor Producrts Images
app.post("/api/deleteVendorDocImage", async (req, res) => {
  try {
    const { id, image } = req.body;
    console.log(id);
    // Remove image file from the folder
    try {
      // Remove the image file using the appropriate method for your file system
      // For example, if using the 'fs' module:
      fs.unlinkSync(`uploads/vendorsProductImages/${image}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove the image file.");
    }

    // Retrieve the existing products column for the vendor
    const selectQuery = `
        SELECT products
        FROM vendors
        WHERE id = $1
      `;
    const selectResult = await pool.query(selectQuery, [id]);
    const existingProducts = selectResult.rows[0]?.products || {};

    // Remove the image entry from the products JSONB object
    const updatedProducts = {
      ...existingProducts,
      images: existingProducts.images.filter((img) => img !== image),
    };

    // Update the vendors table with the updated products JSONB object
    const updateQuery = `
        UPDATE vendors
        SET products = $1
        WHERE id = $2
      `;
    await pool.query(updateQuery, [updatedProducts, id]);

    // Send success response to the frontend
    res.status(200).json({ message: "Image removed successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while removing the image." });
  }
});

// Trademark Certificate Image UPLOADER
// Handle file upload
// img storage path
const imgconfigTrademark = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/vendorsTrademarkCertificates");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `Vendor-TrademarkCertificate-${Date.now()} - ${file.originalname}`
    );
  },
});

// img filter
const isTrademark = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};

const uploadTrademark = multer({
  storage: imgconfigTrademark,
  fileFilter: isTrademark,
});

app.post(
  "/api/uploadTrademarkCertificate",
  uploadTrademark.array("images"),
  async (req, res) => {
    const files = req.files;
    const imageUrls = [];

    // Iterate through the uploaded files and save the image URLs
    for (const file of files) {
      const imageUrl = `${file.filename}`;
      imageUrls.push(imageUrl);
    }

    try {
      let { ids } = req.body; // Assuming you have a productId in the request body

      // Convert ids to an array if it's not already an array
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      // Convert ids to an array of numbers
      const idNumbers = ids.map(Number);

      // Retrieve the existing trademark_certificate column for the vendor
      const selectQuery = `
        SELECT trademark_certificate
        FROM vendors
        WHERE id = ANY ($1::int[])
      `;

      const selectResult = await pool.query(selectQuery, [idNumbers]);

      // Get the existing trademark_certificate JSONB object or initialize an empty object if it doesn't exist
      const existingTrademark =
        selectResult.rows[0]?.trademark_certificate || {};

      // Update the trademark_certificate JSONB object with the new imageUrls
      const updatedTrademark = {
        ...existingTrademark,
        images: imageUrls, // Assuming only one image is uploaded
      };

      console.log(updatedTrademark); // Log the updatedTrademark object to check the value

      // Update the vendors table with the updated trademark_certificate JSONB object
      const updateQuery = `
        UPDATE vendors
        SET trademark_certificate = $1
        WHERE id = ANY ($2::int[])
      `;
      await pool.query(updateQuery, [updatedTrademark, idNumbers]);

      // Send the image URLs as a response to the frontend
      res.status(200).json({ imageUrls, idNumbers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error occurred while storing the image URLs." });
    }
  }
);

// Delete Vendor Trademark Certificates Images
app.post("/api/deleteTrademarkCertificate", async (req, res) => {
  try {
    const { id, image } = req.body;
    // Remove image file from the folder

    // Retrieve the existing products column for the vendor
    const selectQuery = `
        SELECT trademark_certificate
        FROM vendors
        WHERE id = $1
      `;
    const selectResult = await pool.query(selectQuery, [id]);
    const exisitingTrademark =
      selectResult.rows[0]?.trademark_certificate || {};

    // Remove the image entry from the products JSONB object
    const updatedTrademarkCertificate = {
      ...exisitingTrademark,
      images: exisitingTrademark.images.filter((img) => img !== image),
    };

    // Update the vendors table with the updated products JSONB object
    const updateQuery = `
        UPDATE vendors
        SET trademark_certificate = $1
        WHERE id = $2
      `;
    await pool.query(updateQuery, [updatedTrademarkCertificate, id]);
    try {
      // Remove the image file using the appropriate method for your file system
      // For example, if using the 'fs' module:
      fs.unlinkSync(`uploads/vendorsTrademarkCertificates/${image}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove the image file.");
    }
    // Send success response to the frontend
    res.status(200).json({ message: "Image removed successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while removing the image." });
  }
});

// Company Details of Vendors
// Add Vendor Details
app.post("/api/vendorCompanyDetails", async (req, res) => {
  const { selectedKey } = req.body;
  const {
    company_name,
    business_phone,
    business_email,
    business_website,
    business_description,
    company_country,
    company_state,
    company_city,
    company_zip_code,
    shipping_address,
    business_type,
    tax_id_number,
    support_contact_1,
    support_contact_2,
  } = req.body.values;
  try {
    // Perform the update in the database
    const queryText = `
        UPDATE vendors
        SET 
          company_name = $1,
          business_phone = $2,
          business_email = $3,
          business_website = $4,
          business_description = $5,
          company_country = $6,
          company_state = $7,
          company_city = $8,
          company_zip_code = $9,
          shipping_address = $10,
          business_type = $11,
          tax_id_number = $12,
          support_contact_1 = $13,
          support_contact_2 = $14
        WHERE id = $15`;

    const queryParams = [
      company_name,
      business_phone,
      business_email,
      business_website,
      business_description,
      company_country,
      company_state,
      company_city,
      company_zip_code,
      shipping_address,
      business_type,
      tax_id_number,
      support_contact_1,
      support_contact_2,
      selectedKey,
    ];

    await pool.query(queryText, queryParams);

    // Send a response back to the frontend
    res.json({ status: 200, message: "Vendor details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle the vendor status update
app.post("/api/updateVendorApplicationStatus", async (req, res) => {
  try {
    const { id, approvalStatus } = req.body;

    // Check if the request contains id and approvalStatus
    if (!id || !approvalStatus) {
      return res
        .status(400)
        .json({ error: "Vendor ID and New Status are required." });
    }

    // Update the vendor status in the database
    const updateQuery = "UPDATE vendors SET status = $1 WHERE id = $2";
    const values = [approvalStatus, id];
    await pool.query(updateQuery, values);

    // Send a success response
    res
      .status(200)
      .json({ status: 200, message: "Vendor status updated successfully." });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the vendor status." });
  }
});

// Vendor Profile Update Image UPLOADER
// Handle file upload
// img storage path
const imgconfigVendorProfile = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/vendorProfile");
  },
  filename: (req, file, callback) => {
    callback(null, `Vendor-vendorProfile-${Date.now()} - ${file.originalname}`);
  },
});

// img filter
const isVendorProfile = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowed"));
  }
};

const uploadVendorProfile = multer({
  storage: imgconfigVendorProfile,
  fileFilter: isVendorProfile,
});

app.post(
  "/api/vendorProfileUpdate",
  uploadVendorProfile.array("images"),
  async (req, res) => {
    const files = req.files;
    console.log(files);
    const imageUrls = [];

    // Iterate through the uploaded files and save the image URLs
    for (const file of files) {
      const imageUrl = `${file.filename}`;
      imageUrls.push(imageUrl);
    }

    try {
      let { ids } = req.body; // Assuming you have a productId in the request body

      // Convert ids to an array if it's not already an array
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      // Convert ids to an array of numbers
      const idNumbers = ids.map(Number);

      // Retrieve the existing brand_logo column for the vendor
      const selectQuery = `
        SELECT vendor_profile_picture_url
        FROM vendors
        WHERE id = ANY ($1::int[])
      `;

      const selectResult = await pool.query(selectQuery, [idNumbers]);

      // Get the existing vendor_profile_picture_url JSONB object or initialize an empty object if it doesn't exist
      const existingVendorProfile =
        selectResult.rows[0]?.vendor_profile_picture_url || {};

      // Update the vendor_profile_picture_url JSONB object with the new imageUrls
      const updateVendorProfile = {
        ...existingVendorProfile,
        images: imageUrls, // Assuming only one image is uploaded
      };

      console.log(updateVendorProfile); // Log the updateVendorProfile object to check the value

      // Update the vendors table with the updated vendor_profile_picture_url JSONB object
      const updateQuery = `
        UPDATE vendors
        SET vendor_profile_picture_url = $1
        WHERE id = ANY ($2::int[])
      `;
      await pool.query(updateQuery, [updateVendorProfile, idNumbers]);

      // Send the image URLs as a response to the frontend
      res.status(200).json({ imageUrls, idNumbers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error occurred while storing the image URLs." });
    }
  }
);

// Delete Vendor Profile Picture Images
app.post("/api/deleteVendorProfile", async (req, res) => {
  try {
    const { id, image } = req.body;
    // Remove image file from the folder

    // Retrieve the existing products column for the vendor
    const selectQuery = `
        SELECT vendor_profile_picture_url
        FROM vendors
        WHERE id = $1
      `;
    const selectResult = await pool.query(selectQuery, [id]);
    const existingVendorProfile =
      selectResult.rows[0]?.vendor_profile_picture_url || {};

    // Remove the image entry from the products JSONB object
    const updatedVendorProfile = {
      ...existingVendorProfile,
      images: existingVendorProfile.images.filter((img) => img !== image),
    };

    // Update the vendors table with the updated products JSONB object
    const updateQuery = `
        UPDATE vendors
        SET vendor_profile_picture_url = $1
        WHERE id = $2
      `;
    await pool.query(updateQuery, [updatedVendorProfile, id]);
    try {
      // Remove the image file using the appropriate method for your file system
      // For example, if using the 'fs' module:
      fs.unlinkSync(`uploads/vendorProfile/${image}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove the image file.");
    }
    // Send success response to the frontend
    res.status(200).json({ message: "Image removed successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while removing the image." });
  }
});

// Vendor Brand Logo UPLOADER
// Handle file upload
// img storage path
const imgconfigBrandLogo = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/vendorBrandLogo");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `Vendor-vendorBrandLogo-${Date.now()} - ${file.originalname}`
    );
  },
});

// img filter
const isVendorBrandLogo = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowed"));
  }
};

const uploadVendorBrandLogo = multer({
  storage: imgconfigBrandLogo,
  fileFilter: isVendorBrandLogo,
});

app.post(
  "/api/VendorBrandLogoUpdate",
  uploadVendorBrandLogo.array("images"),
  async (req, res) => {
    const files = req.files;
    console.log(files);
    const imageUrls = [];

    // Iterate through the uploaded files and save the image URLs
    for (const file of files) {
      const imageUrl = `${file.filename}`;
      imageUrls.push(imageUrl);
    }

    try {
      let { ids } = req.body; // Assuming you have a productId in the request body

      // Convert ids to an array if it's not already an array
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      // Convert ids to an array of numbers
      const idNumbers = ids.map(Number);

      // Retrieve the existing brand_logo column for the vendor
      const selectQuery = `
        SELECT brand_logo
        FROM vendors
        WHERE id = ANY ($1::int[])
      `;

      const selectResult = await pool.query(selectQuery, [idNumbers]);

      // Get the existing brand_logo JSONB object or initialize an empty object if it doesn't exist
      const existingVendorBrandLogo = selectResult.rows[0]?.brand_logo || {};

      // Update the brand_logo JSONB object with the new imageUrls
      const updateVendorBrandLogo = {
        ...existingVendorBrandLogo,
        images: imageUrls, // Assuming only one image is uploaded
      };

      console.log(updateVendorBrandLogo); // Log the updateVendorBrandLogo object to check the value

      // Update the vendors table with the updated brand_logo JSONB object
      const updateQuery = `
        UPDATE vendors
        SET brand_logo = $1
        WHERE id = ANY ($2::int[])
      `;
      await pool.query(updateQuery, [updateVendorBrandLogo, idNumbers]);

      // Send the image URLs as a response to the frontend
      res.status(200).json({ imageUrls, idNumbers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error occurred while storing the image URLs." });
    }
  }
);

// Delete Brand Logo Images
app.post("/api/deletevendorBrandLogo", async (req, res) => {
  try {
    const { id, image } = req.body;
    // Remove image file from the folder

    // Retrieve the existing products column for the vendor
    const selectQuery = `
        SELECT brand_logo
        FROM vendors
        WHERE id = $1
      `;
    const selectResult = await pool.query(selectQuery, [id]);
    const existingVendorBrandLogo = selectResult.rows[0]?.brand_logo || {};

    // Remove the image entry from the products JSONB object
    const updatedBradnLogo = {
      ...existingVendorBrandLogo,
      images: existingVendorBrandLogo.images.filter((img) => img !== image),
    };

    // Update the vendors table with the updated products JSONB object
    const updateQuery = `
        UPDATE vendors
        SET brand_logo = $1
        WHERE id = $2
      `;
    await pool.query(updateQuery, [updatedBradnLogo, id]);
    try {
      // Remove the image file using the appropriate method for your file system
      // For example, if using the 'fs' module:
      fs.unlinkSync(`uploads/vendorBrandLogo/${image}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove the image file.");
    }
    // Send success response to the frontend
    res.status(200).json({ message: "Image removed successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while removing the image." });
  }
});

// Function to generate a random password
function generateRandomPassword() {
  // Generate a random password logic
  // Replace this with your own logic to generate a random password
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password;
}

// get all admin created tags
app.post("/api/GetAdminTags", async (req, res) => {
  try {
    // Example SQL query to retrieve attributes by vendor_id
    const query = `
          SELECT *
          FROM admintags ORDER BY tag_id;
      `;

    // Execute the query
    const { rows } = await req.pool.query(query);

    // Assuming the data is retrieved successfully, send it as a JSON response
    res.status(200).json({ tags: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create admin tags
app.post("/api/SetTagsValues", async (req, res) => {
  try {
    // Assuming you want to log the data sent in the request body
    const { tag_id, tag_name, tag_values, category_id, subcategory_id, type } =
      req.body;

    if (type === "update") {
      // Implement logic to update the attributes table
      // Example: Assuming you have a PostgreSQL pool named 'pool'
      const updateQuery = `
              UPDATE admintags
              SET tag_values = $1, category_id=$2, subcategory_id=$3, tag_name = $4
              WHERE tag_id = $5;
          `;
      await pool.query(updateQuery, [
        tag_values,
        category_id,
        subcategory_id,
        tag_name,
        tag_id,
      ]);
    } else if (type === "add") {
      // Check if the combination of vendor_id and attribute_name already exists
      const checkQuery = `
              SELECT COUNT(*) AS count
              FROM admintags
              WHERE tag_name = $1;
          `;

      const { rows } = await pool.query(checkQuery, [tag_name]);
      const existingAttributeCount = parseInt(rows[0].count, 10);

      if (existingAttributeCount === 0) {
        // Insert the new attribute if it doesn't exist
        const insertQuery = `
          INSERT INTO admintags (category_id, subcategory_id, tag_name, tag_values)
          VALUES ($1, $2, $3, $4);
        `;
        await pool.query(insertQuery, [
          category_id,
          subcategory_id,
          tag_name,
          tag_values,
        ]);
      } else {
        return res
          .status(400)
          .json({ error: "Attribute with the same name already exists" });
      }
    }

    // Send a response if needed
    res
      .status(200)
      .json({ message: "Data received and Inserted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a tag by tag_id
app.post("/api/DeleteTag", async (req, res) => {
  try {
    const { tag_id } = req.body;

    // Implement the logic to delete the attribute in the database
    const deleteQuery = `
      DELETE FROM admintags
      WHERE tag_id = $1;
    `;
    await req.pool.query(deleteQuery, [tag_id]);

    // Send a success response to the frontend
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error:", error);

    // Send an error response to the frontend
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
