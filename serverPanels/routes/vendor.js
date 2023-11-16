// vendor.js
const express = require("express");
const app = express();
const pool = require("../config"); // Assuming you have a database connection configuration file
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
// const fs = require("fs/promises");
const fs = require("fs");

const sendEmail = require("./nodemailer");
// const fs = require("fs/promises"); // For reading the HTML template

// Twilio for SMS messaging
const { accountSid, authToken, fromNumber } = require("../constants");
const client = require("twilio")(accountSid, authToken);

app.use(express.json());
app.use(cors());

// Assuming you have a connection pool to your database
app.use((req, res, next) => {
  req.pool = pool;
  next();
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
const generateUniqueID = () => {
  const randomPart = Math.floor(Math.random() * 10000).toString(); // Generate a random 4-digit number
  const timestampPart = new Date().getTime().toString().substr(-6, 2); // Use last 2 digits of the current timestamp
  const uniqueID = `${randomPart}${timestampPart}`; // Combine the parts
  return uniqueID;
};

app.post("/vendorLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Use the connection pool to check if the email exists in the database
    const loggedId = generateRandomNumber(); // Generate a 28-character random string
    const result = await req.pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );
    if (result.rows.length > 0) {
      const vendorLogin = result.rows[0];
      const hashedPassword = vendorLogin.password; // Assuming the hashed password is stored in the 'password' field

      if (vendorLogin.status === 4) {
        // Vendor's status is Rejected, prevent login
        res.status(400).send({
          status: 300,
          message: "Login not allowed. Your account has been rejected.",
        });
        return;
      }

      // Compare the hashed password with the input password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, generate random string
        // Update the 'loggedId' column with the generated random string
        await req.pool.query(
          'UPDATE vendors SET "useridvendor" = $1 WHERE email = $2',
          [loggedId, email]
        );

        // Return the updated vendors data
        res
          .status(200)
          .send({ status: 200, data: { ...vendorLogin, loggedId } });
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

app.post("/resetVendorPassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Update the reset_otp column in the vendors table
    const updateResult = await pool.query(
      "UPDATE vendors SET reset_otp = $1 WHERE email = $2",
      [otp, email]
    );

    if (updateResult.rowCount > 0) {
      // Send the OTP to the user's email (you'll need to implement this part)
      // You can use a library like Nodemailer to send the email
      await sendEmail(email, "Reset Code", `Your Reset Code OTP: ${otp}`);

      // For demonstration purposes, we'll just log the OTP
      // console.log(`OTP sent to ${email}: ${otp}`);

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(400).json({ message: "Email Not Found" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/updateForgotPassword", async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;
    // Fetch the reset_otp from the database for the given email
    const queryResult = await pool.query(
      "SELECT reset_otp FROM vendors WHERE email = $1",
      [email]
    );

    if (queryResult.rows.length === 0) {
      // No user found with the provided email
      return res.status(404).json({ message: "User not found" });
    }

    const dbResetOTP = queryResult.rows[0].reset_otp;

    // // Compare the provided OTP with the OTP from the database
    const otpMatch = parseInt(otp) === parseInt(dbResetOTP);

    if (!otpMatch) {
      // Provided OTP doesn't match the one in the database
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // // Hash the new password before updating it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // // Update the password in the database for the user with the provided email
    const updateResult = await pool.query(
      "UPDATE vendors SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    if (updateResult.rowCount > 0) {
      // Password updated successfully
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      // Failed to update the password
      return res.status(500).json({ message: "Failed to update the password" });
    }
  } catch (error) {
    console.error("An error occurred while updating the password", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Send verification otp to sendor email or mobile
app.post("/send-otp", async (req, res) => {
  const { id, type } = req.body;
  let queryResult = [];

  // Fetch the data from the database for the given id
  queryResult = await pool.query("SELECT * FROM vendors WHERE id = $1", [id]);

  if (queryResult.rows.length === 0) {
    // No user found with the provided id
    return res.status(404).json({ message: "User not found" });
  }

  if (type === "email") {
    // Read the HTML email template
    fs.readFile(
      "./htmlTemplates/verification_email_template.html",
      "utf-8",
      (err, htmlTemplate) => {
        if (err) {
          // Handle the error if reading the file fails
          console.error("Error reading email template:", err);
          return res.status(500).json({
            status: 500,
            message: "Internal server error. Please try again later.",
          });
        }

        const htmlContent = htmlTemplate
          .replace(/\[user_name\]/g, queryResult.rows[0].vendorname)
          .replace(/\[verification_code\]/g, queryResult.rows[0].email_otp);

        // Send the verification email
        sendEmail(queryResult.rows[0].email, "Email Verification", htmlContent)
          .then(() => {
            // If the email is sent successfully, return a response to the user
            return res.status(200).json({
              user: queryResult.rows[0],
              message:
                "An email with verification instructions has been sent to your Email account. Please check your Email and follow the instructions to verify your account.",
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
      }
    );
  } else if (type === "mobile") {
    const to =
      queryResult.rows[0].country_code.trim() +
      queryResult.rows[0].mobile_number.trim();

    client.messages
      .create({
        body: `Your Fashion Jalsa Verification Code is: ${queryResult.rows[0].mobile_otp}. DO NOT share this with anyone - Team Fashion Jalsa`,
        from: fromNumber,
        to: to,
      })
      .then((message) => {
        console.log(message.sid);
        return res.status(200).json({
          user: queryResult.rows[0],
          message:
            "A verification message has been sent to your Mobile Number. Please check your Mobile and follow the instructions to verify your account.",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(404).json({ message: "Cannot send otp to mobile" });
      });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { otp, id, verificationType } = req.body;
  try {
    let query;
    let updateQuery;

    if (verificationType === "email") {
      query = {
        text: "SELECT * FROM vendors WHERE email_otp = $1 AND id = $2",
        values: [otp, id],
      };

      updateQuery = {
        text: "UPDATE vendors SET email_verification_status = $1 WHERE email_otp = $2 AND id = $3",
        values: [true, otp, id],
      };
    } else if (verificationType === "mobile") {
      query = {
        text: "SELECT * FROM vendors WHERE mobile_otp = $1 AND id = $2",
        values: [otp, id],
      };

      updateQuery = {
        text: "UPDATE vendors SET mobile_verification_status = $1 WHERE mobile_otp = $2 AND id = $3",
        values: [true, otp, id],
      };
    } else {
      return res.status(400).json({ error: "Invalid verification type" });
    }

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      // Mark the OTP as used or clear it, depending on your logic
      // For example:
      // await pool.query('UPDATE vendors SET email_otp = NULL WHERE email_otp = $1', [otp]);

      // Update verification status
      await pool.query(updateQuery);

      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/getVendorData", async (req, res) => {
  try {
    const loggedId = req.body.loggedId; // Assuming the loggedId value is sent in the request body
    const query = 'SELECT * FROM vendors WHERE "useridvendor" = $1';
    const values = [loggedId];

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/allVendorProducts", async (req, res) => {
  try {
    const subcatNameBackend = req.body.subcatNameBackend;
    // Remove special characters using regex
    const tableName = subcatNameBackend
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, "");

    const getAllVendorProduct = `SELECT * FROM ${tableName} `;
    const result = await pool.query(getAllVendorProduct);

    const products = result.rows;
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addVendorProduct", async (req, res) => {
  try {
    const { city, state, country } = req.body[0].locationData;
    const { subcategory } = req.body[0];
    const uniquepid = generateUniqueID();
    const replaceSubcategory = subcategory
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, "");
    if (replaceSubcategory === "MobileElectronics") {
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        condition,
        category,
        subcategory,
        vendorId,
      } = req.body[0];
      // Insert product and images data into the respective table
      const query = `
                    INSERT INTO mobileelectronics
                    (ad_title, description, images, price, city, state, country, currency_symbol, brand, category, subcategory, vendorid, uniquepid, condition)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING *;
                `;

      const values = [
        ad_title,
        description,
        {},
        price,
        city,
        state,
        country,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        uniquepid,
        condition,
      ];
      const result = await pool.query(query, values);
      // Send response with inserted product data
      res.status(200).json({
        status: 200,
        message: "Product uploaded successfully",
        data: subcategory, // Newly inserted product data
        resp: result.rows[0],
      });
    } else if (replaceSubcategory === "LaptopComputers") {
      const {
        ad_title,
        locationData: { city, state, country },
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        condition,
        skuid,
        mrp,
        sellingprice,
        localdeliverycharge,
        zonaldeliverycharge,
        nationaldeliverycharge,
        weightkg,
        lengthcm,
        breadthcm,
        heightcm,
        countryoforigin,
        manufacturername,
        packerdetails,
        additionaldescription,
        searchkeywords,
        keyfeatures,
        videourl,
        salespackage,
        status,
        selectedCategoryType,
        modelname,
        processor,
        ram,
        storagetype,
        storagecapacity,
        displaysize,
        screenresolution,
        graphicscard,
        operatingsystem,
        connectivityports,
        batterylife,
        keyboardtype,
        touchpad,
        dimensions,
        weight,
        warrantyinformation,
        productType,
        quantity,
        FilteredVariantData,
      } = req.body[0];

      // Insert product data into the table
      const query = `
          INSERT INTO laptopcomputers
          (ad_title, city, state, country, currency_symbol, brand, category, subcategory, vendorid, uniquepid, condition, skuid, mrp, sellingprice, localdeliverycharge, zonaldeliverycharge, nationaldeliverycharge, weightkg, lengthcm, breadthcm, heightcm, countryoforigin, manufacturername, packerdetails, modelname, processor, ram, storagetype, storagecapacity, displaysize, screenresolution, graphicscard, operatingsystem, connectivityports, batterylife, keyboardtype, touchpad, dimensions, weight, warrantyinformation, additionaldescription, searchkeywords, keyfeatures, videourl, salespackage, status, images, category_type, isvariant, quantity)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50)
          RETURNING *;
        `;

      const values = [
        ad_title,
        city,
        state,
        country,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        uniquepid,
        condition,
        skuid,
        mrp,
        sellingprice,
        localdeliverycharge,
        zonaldeliverycharge,
        nationaldeliverycharge,
        weightkg,
        lengthcm,
        breadthcm,
        heightcm,
        countryoforigin,
        manufacturername,
        packerdetails,
        modelname,
        processor,
        ram,
        storagetype,
        storagecapacity,
        displaysize,
        screenresolution,
        graphicscard,
        operatingsystem,
        connectivityports,
        batterylife,
        keyboardtype,
        touchpad,
        dimensions,
        weight,
        warrantyinformation,
        additionaldescription,
        searchkeywords,
        keyfeatures,
        videourl,
        salespackage,
        status,
        {},
        selectedCategoryType,
        productType,
        quantity,
      ];

      const result = await pool.query(query, values);

      const checkSkuidExists = async (sku) => {
        const query = "SELECT * FROM variantproducts WHERE variant_skuid = $1";
        const values = [sku];
        const result = await pool.query(query, values);
        return result.rows.length > 0; // Match found if rows exist
      };

      // Loop through FilteredVariantData
      for (const variant of FilteredVariantData) {
        console.log(variant);

        // Check if a match exists in variantproducts based on SKU
        const isMatch = await checkSkuidExists(variant.sku);

        if (isMatch) {
          // SKU already exists, return an error
          return res
            .status(400)
            .json({ error: "SKU already exists in variantproducts" });
        } else {
          // Insert a new record
          const insertQuery = `
            INSERT INTO variantproducts (label, product_uniqueid, variant_mrp, variant_sellingprice, variant_skuid, variant_quantity, variantsvalues, vendori_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `;

          const insertValues = [
            variant.label,
            uniquepid,
            variant.price,
            variant.sellingPrice,
            variant.sku,
            variant.quantity,
            variant.variantsValue,
            vendorId,
          ];

          await pool.query(insertQuery, insertValues);
        }
      }

      // Send response with inserted product data
      res.status(200).json({
        status: 200,
        message: "Product uploaded successfully",
        data: subcategory, // Newly inserted product data
        resp: result.rows[0],
      });
    } else if (replaceSubcategory === "CameraPhotography") {
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        condition,
      } = req.body[0];

      // Insert product and images data into the respective table
      const query = `
                    INSERT INTO cameraphotography
                    (ad_title, description, images, price, city, state, country, currency_symbol, brand, category, subcategory, vendorid, uniquepid, condition)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING *;
                `;

      const values = [
        ad_title,
        description,
        {},
        price,
        city,
        state,
        country,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        uniquepid,
        condition,
      ];
      const result = await pool.query(query, values);
      res.status(200).json({
        status: 200,
        message: "Product uploaded successfully",
        data: subcategory, // Newly inserted product data
        resp: result.rows[0],
      });
    } else if (replaceSubcategory === "AudioHeadphones") {
      tableName = "audioheadphones";
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        condition,
      } = req.body[0];

      // Insert product and images data into the respective table
      const query = `
                    INSERT INTO audioheadphones
                    (ad_title, description, images, price, city, state, country, currency_symbol, brand, category, subcategory, vendorid, uniquepid, condition)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING *;
                `;

      const values = [
        ad_title,
        description,
        {},
        price,
        city,
        state,
        country,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        uniquepid,
        condition,
      ];
      const result = await pool.query(query, values);
      res.status(200).json({
        status: 200,
        message: "Product uploaded successfully",
        data: subcategory, // Newly inserted product data
        resp: result.rows[0],
      });
    }
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

app.post("/updateVendorProduct", async (req, res) => {
  try {
    console.log(req.body[0]);

    const id = req.body[0].selectedKey;
    const { city, state, country } = req.body[0].locationData;
    const { subcategory } = req.body[0];
    const replaceSubcategory = subcategory
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, "");

    let query;
    let values;
    let tableName;

    if (replaceSubcategory === "MobileElectronics") {
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        condition,
        category,
        subcategory,
        vendorId, // Add the vendorId field
        selectedCategoryType,
      } = req.body[0];
      tableName = "mobileelectronics";
      query = `
          UPDATE ${tableName}
          SET
              ad_title = $1,
              description = $2,
              price = $3,
              currency_symbol = $4,
              brand = $5,
              category = $6,
              subcategory = $7,
              city = $8,
              state = $9,
              country = $10,
              vendorid = $11,
              status = 0,
              condition = $14,
              category_type = $12
          WHERE product_me_id = $13
          RETURNING *;
      `;
      values = [
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        city,
        state,
        country,
        vendorId,
        selectedCategoryType,
        id,
        condition,
      ];
    } else if (replaceSubcategory === "LaptopComputers") {
      const {
        ad_title,
        locationData: { city, state, country },
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        condition,
        skuid,
        mrp,
        sellingprice,
        localdeliverycharge,
        zonaldeliverycharge,
        nationaldeliverycharge,
        weightkg,
        lengthcm,
        breadthcm,
        heightcm,
        countryoforigin,
        manufacturername,
        packerdetails,
        additionaldescription,
        searchkeywords,
        keyfeatures,
        videourl,
        salespackage,
        status,
        selectedCategoryType,
        modelname,
        processor,
        ram,
        storagetype,
        storagecapacity,
        displaysize,
        screenresolution,
        graphicscard,
        operatingsystem,
        connectivityports,
        batterylife,
        keyboardtype,
        touchpad,
        dimensions,
        weight,
        warrantyinformation,
        id,
        productType,
        quantity,
        FilteredVariantData,
        SelectedUniqueId,
      } = req.body[0];

      // Update laptopcomputers table
      query = `
        UPDATE laptopcomputers
        SET
            ad_title = $1, city = $2, state = $3, country = $4, currency_symbol = $5,
            brand = $6, category = $7, subcategory = $8, vendorid = $9, condition = $10,
            skuid = $11, mrp = $12, sellingprice = $13, localdeliverycharge = $14,
            zonaldeliverycharge = $15, nationaldeliverycharge = $16, weightkg = $17,
            lengthcm = $18, breadthcm = $19, heightcm = $20, countryoforigin = $21,
            manufacturername = $22, packerdetails = $23, additionaldescription = $24,
            searchkeywords = $25, keyfeatures = $26, videourl = $27, salespackage = $28,
            status = $29, category_type = $30, modelname = $31, processor = $32, ram = $33,
            storagetype = $34, storagecapacity = $35, displaysize = $36, screenresolution = $37,
            graphicscard = $38, operatingsystem = $39, connectivityports = $40, batterylife = $41,
            keyboardtype = $42, touchpad = $43, dimensions = $44, weight = $45, warrantyinformation = $46, isvariant = $48, quantity = $49
        WHERE product_lc_id = $47
        RETURNING *;
      `;

      values = [
        ad_title,
        city,
        state,
        country,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId,
        condition,
        skuid,
        mrp,
        sellingprice,
        localdeliverycharge,
        zonaldeliverycharge,
        nationaldeliverycharge,
        weightkg,
        lengthcm,
        breadthcm,
        heightcm,
        countryoforigin,
        manufacturername,
        packerdetails,
        additionaldescription,
        searchkeywords,
        keyfeatures,
        videourl,
        salespackage,
        status,
        selectedCategoryType,
        modelname,
        processor,
        ram,
        storagetype,
        storagecapacity,
        displaysize,
        screenresolution,
        graphicscard,
        operatingsystem,
        connectivityports,
        batterylife,
        keyboardtype,
        touchpad,
        dimensions,
        weight,
        warrantyinformation,
        id,
        productType,
        quantity,
      ];

      // Check if skuid and SelectedUniqueId match in variantproducts
      const checkSkuidSelectedUniqueId = async (sku) => {
        const query = "SELECT * FROM variantproducts WHERE variant_skuid = $1";
        const values = [sku];
        const result = await pool.query(query, values);
        return result.rows.length > 0; // Match found if rows exist
      };

      // Loop through FilteredVariantData
      for (const variant of FilteredVariantData) {
        console.log(variant);

        // Check if a match exists in variantproducts
        const isMatch = await checkSkuidSelectedUniqueId(variant.sku);

        if (isMatch) {
          // Update the existing record
          const updateQuery = `
            UPDATE variantproducts
            SET
              variant_mrp = $1,
              variant_sellingprice = $2,
              variant_quantity = $3,
              variantsvalues = $4,
              label = $7
            WHERE product_uniqueid = $5 AND variant_skuid = $6
            RETURNING *;
          `;

          const updateValues = [
            variant.price,
            variant.sellingPrice,
            variant.quantity,
            variant.variantsValue,
            SelectedUniqueId,
            variant.sku,
            variant.label,
          ];

          await pool.query(updateQuery, updateValues);
        } else {
          // Insert a new record
          const insertQuery = ` 
            INSERT INTO variantproducts (label, product_uniqueid, variant_mrp, variant_sellingprice, variant_skuid, variant_quantity, variantsvalues, vendori_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `;

          const insertValues = [
            variant.label,
            SelectedUniqueId,
            variant.price,
            variant.sellingPrice,
            variant.sku,
            variant.quantity,
            variant.variantsValue,
            vendorId,
          ];

          await pool.query(insertQuery, insertValues);
        }
      }

      return res
        .status(200)
        .json({ message: "Product updated and variants added successfully" });
    } else if (replaceSubcategory === "CameraPhotography") {
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId, // Add the vendorId field
        selectedCategoryType,
        condition,
      } = req.body[0];
      tableName = "cameraphotography";
      query = `
          UPDATE ${tableName}
          SET
              ad_title = $1,
              description = $2,
              price = $3,
              currency_symbol = $4,
              brand = $5,
              category = $6,
              subcategory = $7,
              city = $8,
              state = $9,
              country = $10,
              vendorid = $11,
              status = 0,
              category_type = $12,
              condition = $14
          WHERE product_cp_id = $13
          RETURNING *;
      `;
      values = [
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        city,
        state,
        country,
        vendorId,
        selectedCategoryType,
        id,
        condition,
      ];
    } else if (replaceSubcategory === "AudioHeadphones") {
      tableName = "audioheadphones";
      const {
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        vendorId, // Add the vendorId field
        selectedCategoryType,
        condition,
      } = req.body[0];
      query = `
          UPDATE ${tableName}
          SET
              ad_title = $1,
              description = $2,
              price = $3,
              currency_symbol = $4,
              brand = $5,
              category = $6,
              subcategory = $7,
              city = $8,
              state = $9,
              country = $10,
              vendorid = $11,
              status = 0,
              category_type = $12,
              condition = $14
          WHERE product_ah_id = $13
          RETURNING *;
      `;
      values = [
        ad_title,
        description,
        price,
        selectedCurrency,
        brand,
        category,
        subcategory,
        city,
        state,
        country,
        vendorId,
        selectedCategoryType,
        id,
        condition,
      ];
      // Set values and query for this case
    } else {
      return res.status(400).json({
        status: 400,
        message: "Invalid subcategory",
      });
    }

    const result = await pool.query(query, values);

    res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: subcategory, // Updated product data
      resp: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

app.post("/DeleteVendorProduct", async (req, res) => {
  try {
    const { key, subcatNameBackend } = req.body;
    const tableName = subcatNameBackend
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, "");
    console.log(tableName, key);
    // Delete the product with the given id and subcatNameBackend
    let query;
    if (tableName == "mobileelectronics") {
      query = `
            DELETE FROM ${tableName}
            WHERE product_me_id = $1;
        `;
    } else if (tableName == "laptopcomputers") {
      query = `
            DELETE FROM ${tableName}
            WHERE product_lc_id = $1;
        `;
    } else if (tableName == "cameraphotography") {
      query = `
            DELETE FROM ${tableName}
            WHERE product_cp_id = $1;
        `;
    }

    const values = [key];

    await pool.query(query, values);

    res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

const subcategoryColumnMapping = {
  "Mobile Electronics": [
    "ad_title",
    "description",
    "brand",
    "currency_symbol",
    "price",
    "category",
    "subcategory",
    "condition",
    "city",
    "state",
    "country",
  ],
  "Laptop & Computers": [
    "ad_title",
    "description",
    "brand",
    "currency_symbol",
    "price",
    "category",
    "subcategory",
    "condition",
    "city",
    "state",
    "country",
  ],
  "Camera & Photography": [
    "ad_title",
    "description",
    "brand",
    "currency_symbol",
    "price",
    "category",
    "subcategory",
    "condition",
    "city",
    "state",
    "country",
  ],
  "Audio & Headphones": [
    "ad_title",
    "description",
    "brand",
    "currency_symbol",
    "price",
    "category",
    "subcategory",
    "condition",
    "city",
    "state",
    "country",
  ],
  // Add more subcategories and their corresponding column names
};

// Bulk Product Uploads
app.post("/BulkProductUpload", async (req, res) => {
  const { jsonData, subcategory } = req.body;

  try {
    // Determine the appropriate table based on subcategory
    const tableName = getTableNameBySubcategory(subcategory);
    // Get the columns specific to the subcategory from the mapping
    const subcategoryColumns = subcategoryColumnMapping[subcategory];

    if (!subcategoryColumns) {
      return res.status(400).json({ error: "Invalid subcategory" });
    }

    // Build the column names and values based on the keys in jsonData
    const columns = subcategoryColumns.join(", ");

    let query;
    if (tableName === "mobileelectronics") {
      const values = await Promise.all(
        jsonData.map(async (data) => {
          const createdAt = new Date().toISOString();
          const imageUrl = data.key8; // Assuming the URL is in key8
          let imageFileName = "";

          // Check if the image URL is valid using fetch
          try {
            const response = await fetch(imageUrl, {
              headers: {
                Accept: "image/jpeg", // Use image/jpeg MIME type
              },
            });
            if (response.ok) {
              // Download the image and save it to the uploads folder
              imageFileName = `${Date.now()}_${path.basename(
                imageUrl,
                ".jpg"
              )}.jpg`; // Include ".jpg" extension
              const imageBuffer = await response.arrayBuffer();
              const imagePath = path.join(
                __dirname,
                "..",
                "uploads/UploadedProductsFromVendors",
                imageFileName
              );
              fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
            }
          } catch (error) {
            console.error("Error downloading image:", error);
          }

          const columnValues = `'${data.key1}', '${data.key2}', '${data.key3}', '${data.key4}', ${data.key5}, '${data.key6}', '${data.key7}', '${data.key9}', '${data.city}', '${data.state}', '${data.country}', '${data.vendorid}','${createdAt}', '{${imageFileName}}', 0, '${data.uniquepid}'`;
          return `(${columnValues})`;
        })
      );
      query = `INSERT INTO ${tableName} (${columns}, vendorid, created_at, images, status, uniquepid) VALUES ${values.join(
        ", "
      )}`;
    } else if (tableName === "laptopcomputers") {
      const values = await Promise.all(
        jsonData.map(async (data) => {
          const createdAt = new Date().toISOString();
          const imageUrl = data.key8; // Assuming the URL is in key8
          let imageFileName = "";

          // Check if the image URL is valid using fetch
          try {
            const response = await fetch(imageUrl, {
              headers: {
                Accept: "image/jpeg", // Use image/jpeg MIME type
              },
            });
            if (response.ok) {
              // Download the image and save it to the uploads folder
              imageFileName = `${Date.now()}_${path.basename(
                imageUrl,
                ".jpg"
              )}.jpg`; // Include ".jpg" extension
              const imageBuffer = await response.arrayBuffer();
              const imagePath = path.join(
                __dirname,
                "..",
                "uploads/UploadedProductsFromVendors",
                imageFileName
              );
              fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
            }
          } catch (error) {
            console.error("Error downloading image:", error);
          }

          const columnValues = `'${data.key1}', '${data.key2}', '${data.key3}', '${data.key4}', ${data.key5}, '${data.key6}', '${data.key7}', '${data.city}', '${data.state}', '${data.country}', '${data.vendorid}','${createdAt}', '{${imageFileName}}', 0, '${data.uniquepid}'`;
          return `(${columnValues})`;
        })
      );
      query = `INSERT INTO ${tableName} (${columns}, vendorid, created_at, images, status, uniquepid) VALUES ${values.join(
        ", "
      )}`;
    }

    // Execute the query
    await pool.query(query);

    res.status(200).json({ message: "Data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).json({ error: "Error uploading data" });
  }
});

// Bulk Product Deleted
app.post("/deleteProducts", async (req, res) => {
  const { productIds, subcatNameBackend } = req.body;

  try {
    // Determine the appropriate table based on subcategory (subcatName)
    const tableName = subcatNameBackend
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, ""); // Replace with the actual subcategory name
    const whereColumn =
      tableName === "mobileelectronics"
        ? "product_me_id"
        : tableName === "laptopcomputers"
        ? "product_lc_id"
        : tableName === "cameraphotography"
        ? "product_cp_id"
        : tableName === "audioheadphones"
        ? "product_ah_id"
        : "";

    // Fetch image filenames from the database
    const imageQuery = `SELECT images FROM ${tableName} WHERE ${whereColumn} IN (${productIds.join(
      ", "
    )})`;
    const imageResult = await pool.query(imageQuery);
    const imageFilenames = imageResult.rows.map((row) => row.images);

    // Construct the SQL query to delete selected products
    const query = `DELETE FROM ${tableName} WHERE ${whereColumn} IN (${productIds.join(
      ", "
    )})`;

    // Execute the query
    await pool.query(query);

    // Unlink images from folder
    imageFilenames.forEach((filenamesArray) => {
      filenamesArray.forEach((filename) => {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "UploadedProductsFromVendors",
          filename
        );
        fs.unlinkSync(imagePath); // Unlink the image file
      });
    });

    res.status(200).json({ message: "Selected products deleted successfully" });
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ error: "Error deleting products" });
  }
});

function getTableNameBySubcategory(subcategory) {
  const subcategoryToTable = {
    "Mobile Electronics": "mobileelectronics",
    "Laptop & Computers": "laptopcomputers",
    "Camera & Photography": "cameraphotography",
    "Audio & Headphones": "audioheadphones",
    // Add more mappings for other subcategories as needed
  };

  const sanitizedSubcategory = subcategory.trim(); // Trim and sanitize input
  return subcategoryToTable[sanitizedSubcategory] || "default_table";
}

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/UploadedProductsFromVendors/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Get the current timestamp
    const extension = path.extname(file.originalname); // Get the file extension
    const filename = `${timestamp}-${file.originalname}`; // Create the new filename with timestamp
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Endpoint for file upload
// Endpoint for file upload and product insertion
app.post(
  "/uploadVendorProduct",
  upload.array("files", 10),
  async (req, res) => {
    try {
      const subcategories = [];

      if (Array.isArray(req.body.data)) {
        for (const item of req.body.data) {
          try {
            const parsedItem = JSON.parse(item);
            subcategories.push(parsedItem);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      } else {
        try {
          const parsedItem = JSON.parse(req.body.data);
          subcategories.push(parsedItem);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      console.log(subcategories);
      if (subcategories.length === 0) {
        res.status(400).json({
          status: 400,
          message: "Invalid JSON data",
        });
        return;
      }

      const allSubcategoriesMatch = subcategories[0][0].subcategory
        ?.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s/g, ""); // output: mobileelectronics
      const id = subcategories[0][0].selectedKey;
      console.log(id);
      // Extract image paths from the uploaded files
      const newImages = req.files.map((file) => `${file.filename}`);

      let existingImages = [];

      if (allSubcategoriesMatch === "mobileelectronics") {
        const query = `
                SELECT images
                FROM mobileelectronics
                WHERE product_me_id = $1;
            `;

        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
          existingImages = result.rows[0].images;
        }

        existingImages = [...existingImages, ...newImages];

        const updateQuery = `
                UPDATE mobileelectronics
                SET images = $1
                WHERE product_me_id = $2;
            `;

        const updateValues = [
          existingImages, // Convert images array to a PostgreSQL array representation
          id,
        ];

        await pool.query(updateQuery, updateValues);

        // Send response with updated images
        res.status(200).json({
          status: 200,
          message: "Product images updated successfully",
          updatedImages: existingImages,
        });
      } else if (allSubcategoriesMatch === "laptopcomputers") {
        const query = `
            SELECT images
            FROM laptopcomputers
            WHERE product_lc_id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
          existingImages = result.rows[0].images;
        }

        existingImages = [...existingImages, ...newImages];

        const updateQuery = `
            UPDATE laptopcomputers
            SET images = $1
            WHERE product_lc_id = $2;
        `;

        const updateValues = [
          existingImages, // Convert images array to a PostgreSQL array representation
          id,
        ];

        await pool.query(updateQuery, updateValues);

        // Send response with updated images
        res.status(200).json({
          status: 200,
          message: "Product images updated successfully",
          updatedImages: existingImages,
        });
      } else if (allSubcategoriesMatch === "cameraphotography") {
        const query = `
            SELECT images
            FROM cameraphotography
            WHERE product_cp_id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
          existingImages = result.rows[0].images;
        }

        existingImages = [...existingImages, ...newImages];

        const updateQuery = `
            UPDATE cameraphotography
            SET images = $1
            WHERE product_cp_id = $2;
        `;

        const updateValues = [
          existingImages, // Convert images array to a PostgreSQL array representation
          id,
        ];

        await pool.query(updateQuery, updateValues);

        // Send response with updated images
        res.status(200).json({
          status: 200,
          message: "Product images updated successfully",
          updatedImages: existingImages,
        });
      } else if (allSubcategoriesMatch === "audioheadphones") {
        const query = `
            SELECT images
            FROM audioheadphones
            WHERE product_ah_id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
          existingImages = result.rows[0].images;
        }

        existingImages = [...existingImages, ...newImages];

        const updateQuery = `
            UPDATE audioheadphones
            SET images = $1
            WHERE product_ah_id = $2;
        `;

        const updateValues = [
          existingImages, // Convert images array to a PostgreSQL array representation
          id,
        ];

        await pool.query(updateQuery, updateValues);

        // Send response with updated images
        res.status(200).json({
          status: 200,
          message: "Product images updated successfully",
          updatedImages: existingImages,
        });
      } else {
        // Handle other cases (e.g., insert or update other tables)
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
);

app.post("/removeImage", async (req, res) => {
  console.log(req.body);
  try {
    const { subcategory, productId, imageIndex } = req.body;
    const subcat = subcategory
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, "");

    let imagesColumn = "";
    let productTable = "";
    let productKeyColumn = "";

    // Determine the appropriate column and table based on subcategory
    if (subcat === "mobileelectronics") {
      imagesColumn = "images";
      productTable = "mobileelectronics";
      productKeyColumn = "product_me_id";
    } else if (subcat === "laptopcomputers") {
      imagesColumn = "images";
      productTable = "laptopcomputers";
      productKeyColumn = "product_lc_id";
    } else if (subcat === "cameraphotography") {
      imagesColumn = "images";
      productTable = "cameraphotography";
      productKeyColumn = "product_cp_id";
    } else if (subcat === "audioheadphones") {
      imagesColumn = "images";
      productTable = "audioheadphones";
      productKeyColumn = "product_ah_id";
    } else {
      // Handle other cases if needed
    }

    if (imagesColumn && productTable && productKeyColumn) {
      const query = `
        SELECT ${imagesColumn}
        FROM ${productTable}
        WHERE ${productKeyColumn} = $1;
      `;

      const result = await pool.query(query, [productId]);

      if (result.rows.length > 0) {
        const images = result.rows[0][imagesColumn];
        const removedImage = images.splice(imageIndex, 1)[0]; // Remove and get the image at the specified index

        console.log("Removed Image:", removedImage); // Debugging

        const updateQuery = `
          UPDATE ${productTable}
          SET ${imagesColumn} = $1
          WHERE ${productKeyColumn} = $2;
        `;

        await pool.query(updateQuery, [images, productId]);

        // Unlink the image file from the folder
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "UploadedProductsFromVendors",
          removedImage
        );

        console.log("Image Path:", imagePath); // Debugging

        fs.unlinkSync(imagePath);

        // Send response with updated images
        res.status(200).json({
          status: 200,
          message: "Image removed successfully",
          updatedImages: images,
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Product not found",
        });
      }
    } else {
      // Handle other cases if needed
    }
  } catch (error) {
    console.error("Error removing image:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// Fetch rejected products from a specific category
const fetchRejectedProducts = async (category) => {
  try {
    const query = `
            SELECT p.*, v.*, p.status AS productstatus, v.status AS vendorstatus
            FROM ${category} AS p
            JOIN vendors AS v ON p.vendorid = v.id;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Fetch rejected products for all categories
app.get("/rejected-products", async (req, res) => {
  try {
    const categories = [
      "laptopcomputers",
      "mobileelectronics",
      "audioheadphones",
      "cameraphotography",
    ];
    const allRejectedProducts = [];

    for (const category of categories) {
      const rejectedProducts = await fetchRejectedProducts(category);
      allRejectedProducts.push(...rejectedProducts);
    }

    const modifiedRejectedProducts = allRejectedProducts.map((product) => ({
      ...product,
      key:
        product.product_lc_id ||
        product.product_me_id ||
        product.product_ah_id ||
        product.product_cp_id, // Use appropriate key
    }));

    res.json(modifiedRejectedProducts);
  } catch (error) {
    console.error("Error fetching rejected products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/reject-product-reason", async (req, res) => {
  try {
    const { productId, rejectReason } = req.body;
    const { subcategory } = productId;

    let updateQuery = "";
    let updateValues = [];
    let idName = "";

    // Construct the update query and values based on subcategory
    if (subcategory === "Laptop & Computers") {
      updateQuery = `
                UPDATE laptopcomputers
                SET rejection_reason = $1, status = 2, updated_at_product = NOW()
                WHERE product_lc_id = $2
            `;
      idName = "product_lc_id";
      updateValues = [rejectReason, productId.product_lc_id];
    } else if (subcategory === "Mobile Electronics") {
      updateQuery = `
                UPDATE mobileelectronics
                SET rejection_reason = $1, status = 2, updated_at_product = NOW()
                WHERE product_me_id = $2
            `;
      idName = "product_me_id";
      updateValues = [rejectReason, productId.product_me_id];
    } else if (subcategory === "Camera & Photography") {
      updateQuery = `
                UPDATE cameraphotography
                SET rejection_reason = $1, status = 2, updated_at_product = NOW()
                WHERE product_cp_id = $2
            `;
      idName = "product_cp_id";
      updateValues = [rejectReason, productId.product_cp_id];
    } else if (subcategory === "Audio & Headphones ") {
      updateQuery = `
                UPDATE audioheadphones
                SET rejection_reason = $1, status = 2, updated_at_product = NOW()
                WHERE product_ah_id = $2
            `;
      idName = "product_ah_id";
      updateValues = [rejectReason, productId.product_ah_id];
    } else {
      // Handle other subcategories here if needed
      // You can add more conditions as per your schema
    }

    if (updateQuery) {
      await pool.query(updateQuery, updateValues);
      res
        .status(200)
        .json({ idName, message: "Product rejected successfully" });
    } else {
      res.status(400).json({ error: "Invalid subcategory" });
    }
  } catch (error) {
    console.error("Error rejecting product:", error);
    res.status(500).json({ error: "Failed to reject the product" });
  }
});

app.post("/approve-product", async (req, res) => {
  try {
    const { productId } = req.body;
    const { subcategory } = productId;

    let updateQuery = "";
    let updateValues = [];
    let idName = "";

    // Construct the update query and values based on subcategory
    if (subcategory === "Laptop & Computers") {
      updateQuery = `
                UPDATE laptopcomputers
                SET status = 1, updated_at_product = NOW()
                WHERE product_lc_id = $1
            `;
      idName = "product_lc_id";
      updateValues = [productId.product_lc_id];
    } else if (subcategory === "Mobile Electronics") {
      updateQuery = `
                UPDATE mobileelectronics
                SET status = 1, updated_at_product = NOW()
                WHERE product_me_id = $1
            `;
      idName = "product_me_id";
      updateValues = [productId.product_me_id];
    } else if (subcategory === "Camera & Photography") {
      updateQuery = `
                UPDATE cameraphotography
                SET status = 1, updated_at_product = NOW()
                WHERE product_cp_id = $1
            `;
      idName = "product_cp_id";
      updateValues = [productId.product_cp_id];
    } else if (subcategory === "Audio & Headphones ") {
      updateQuery = `
                UPDATE audioheadphones
                SET status = 1, updated_at_product = NOW()
                WHERE product_ah_id = $1
            `;
      idName = "product_ah_id";
      updateValues = [productId.product_ah_id];
    } else {
      // Handle other subcategories here if needed
      // You can add more conditions as per your schema
    }

    if (updateQuery) {
      await pool.query(updateQuery, updateValues);
      res
        .status(200)
        .json({ idName, message: "Product Approved successfully" });
    } else {
      res.status(400).json({ error: "Invalid subcategory" });
    }
  } catch (error) {
    console.error("Error rejecting product:", error);
    res.status(500).json({ error: "Failed to reject the product" });
  }
});

const AllProducts = [];

async function fetchAllDataFromTables(pool) {
  try {
    const allData = [];
    const tableNames = [
      "mobileelectronics",
      "laptopcomputers",
      "audioheadphones",
      "cameraphotography",
    ]; // Replace with your table names
    // Iterate over table names
    for (const tableName of tableNames) {
      const result = await pool.query(`SELECT * FROM ${tableName}`);

      // Store the fetched data in the 'allData' array
      allData.push(...result.rows);
    }

    return allData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Internal Server Error");
  }
}

app.get("/AllProductsVendors", async (req, res) => {
  try {
    const tableNames = [
      "mobileelectronics",
      "laptopcomputers",
      "audioheadphones",
      "cameraphotography",
    ]; // Replace with your table names

    // Iterate over table names
    for (const tableName of tableNames) {
      const result = await pool.query(`SELECT * FROM ${tableName}`);

      // Store the fetched data in the 'data' array
      AllProducts.push(...result.rows);
    }

    res.json(AllProducts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define an API endpoint to fetch data
app.get("/generateReport", async (req, res) => {
  try {
    // Extract parameters from the request
    const { startDate, endDate, vendorId } = req.query;

    // Query the database to fetch data for the specified date range and vendor
    const queryResult = await pool.query(
      "SELECT * FROM vendorproductorder WHERE vendor_id = $1 AND order_date >= $2 AND order_date <= $3",
      [vendorId, startDate, endDate]
    );

    const vendorQuery = await pool.query(
      "SELECT * FROM vendors WHERE id = $1",
      [vendorId]
    );

    // Calculate total earnings, expenses, and net profit for each currency_symbol
    const currencyTotals = {};
    const vendorData = queryResult.rows;
    const vendors = vendorQuery.rows[0];
    vendorData.forEach((order) => {
      const currencySymbol = order.currency_symbol;
      if (!currencyTotals[currencySymbol]) {
        currencyTotals[currencySymbol] = {
          totalEarnings: 0,
          expenses: 0,
        };
      }

      currencyTotals[currencySymbol].totalEarnings += parseFloat(
        order.total_amount
      );
      currencyTotals[currencySymbol].expenses += parseFloat(order.fees_paid);
    });

    // Calculate net profit for each currency
    for (const currency in currencyTotals) {
      currencyTotals[currency].netProfit =
        currencyTotals[currency].totalEarnings -
        currencyTotals[currency].expenses;
    }

    // Group orders by order status
    const orderStatusGroups = {};
    vendorData.forEach((order) => {
      const orderStatus = order.order_status;
      if (!orderStatusGroups[orderStatus]) {
        orderStatusGroups[orderStatus] = [];
      }
      orderStatusGroups[orderStatus].push(order);
    });

    // Calculate product performance
    const productPerformance = {};

    vendorData.forEach((order) => {
      const product_uniqueid = order.product_uniqueid;
      if (!productPerformance[product_uniqueid]) {
        productPerformance[product_uniqueid] = 0;
      }
      productPerformance[product_uniqueid] += parseFloat(order.total_amount);
    });

    // Sort products by total performance in descending order
    const sortedProducts = Object.keys(productPerformance).sort(
      (a, b) => productPerformance[b] - productPerformance[a]
    );

    // Specify the number of top-performing products you want to retrieve (e.g., top 5)
    const numberOfTopProducts = 5;
    const AllProducts = await fetchAllDataFromTables(pool);

    // Get the top N products
    const topPerformingProducts = sortedProducts.slice(0, numberOfTopProducts);
    const filteredProducts = AllProducts.filter((product) =>
      topPerformingProducts.includes(product.uniquepid)
    );
    // Now, topPerformingProducts contains the product_uniqueid values of the top-performing products
    // Get the unique currency symbols
    const uniqueCurrencies = [
      ...new Set(vendorData.map((order) => order.currency_symbol)),
    ];
    0.0;

    // Generate the report
    const report = {
      vendorId,
      startDate,
      endDate,
      currencyReports: uniqueCurrencies.map((currency) => ({
        currencySymbol: currency,
        totalEarnings: currencyTotals[currency].totalEarnings.toFixed(2),
        expenses: currencyTotals[currency].expenses.toFixed(2),
        netProfit: currencyTotals[currency].netProfit.toFixed(2),
      })),
      orderMetrics: orderStatusGroups, // Orders grouped by order status
      filteredProducts, // Top 5 best-performing products
      vendors,
    };

    // Send the report as a JSON response
    res.json(report);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllVendorAttributes/:vendorId", async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    // Query the database to get all attributes for the specified vendor
    const query = "SELECT * FROM attributes WHERE vendor_id = $1";
    const { rows } = await pool.query(query, [vendorId]);

    // Send the attributes as JSON response
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vendor attributes" });
  }
});

app.get("/variant-products", async (req, res) => {
  try {
    // Query the database to fetch variant products
    const query = "SELECT * FROM variantproducts"; // Replace with your table name
    const { rows } = await pool.query(query);

    // Send the fetched data as JSON response
    res.json(rows);
  } catch (error) {
    console.error("Error fetching variant products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
