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

app.post("/VendorProductOrder", async (req, res) => {
  const { type, vendorId } = req.body;
  console.log(req.body);
  try {
    let query = "SELECT * FROM vendorproductorder";

    if (type === "admin") {
      // If the type is "admin," fetch all data without specifying a vendor_id
      query += ";";
    } else {
      // If the type is not "admin," fetch data for the specified vendor_id
      query += " WHERE vendor_id = $1;";
    }

    const { rows } = await pool.query(
      query,
      type === "admin" ? [] : [vendorId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customer-orders-by-month/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  try {
    // const query = `
    //     SELECT
    //         TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM') AS month_start,
    //         COUNT(DISTINCT customer_id) AS total_customers_with_orders,
    //         currency_symbol
    //     FROM
    //         vendorproductorder
    //     WHERE
    //         vendor_id = $1
    //     GROUP BY
    //         month_start, currency_symbol
    //     ORDER BY
    //         month_start;
    //   `;

    const query = `
      SELECT 
        to_char(date_trunc('month', order_date), 'yyyy-mm') AS month_start,
        count(distinct customer_id) as total_customers_with_orders,
        currency
      FROM orders o
      WHERE EXISTS (
        SELECT 1
        FROM orderitems oi
        LEFT JOIN products p ON p.product_id = oi.product_id
        WHERE oi.order_id = o.order_id
          AND p.vendor_id = $1
      )
      GROUP BY month_start, currency
      ORDER BY month_start;
      `;

    const result = await pool.query(query, [vendor_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/sales-by-month", async (req, res) => {
  const { type, vendorId } = req.body; // Get the "type" and "vendor_id" from the request body
  try {
    let query = `
        SELECT 
            TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM-DD') AS month_start,
            EXTRACT(YEAR FROM order_date) AS order_year,
            currency_symbol,
            SUM(total_amount) AS total_sales,
            SUM(SUM(total_amount)) OVER (PARTITION BY EXTRACT(YEAR FROM order_date)) AS total_sales_per_year
        FROM 
            vendorproductorder
        `;

    if (type === "admin") {
      // If the type is "admin," fetch all orders without specifying a vendor_id
      query += `
        GROUP BY 
            month_start, order_year, currency_symbol
        ORDER BY 
            month_start;
        `;
    } else {
      // If the type is not "admin," fetch orders for the specified vendor_id
      query += `
        WHERE
            vendor_id = $1
        GROUP BY 
            month_start, order_year, currency_symbol
        ORDER BY 
            month_start;
        `;
    }

    const { rows } = await pool.query(
      query,
      type === "admin" ? [] : [vendorId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/sales-by-day/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  const { date } = req.query;

  try {
    const selectedDate = new Date(date);
    const dayBeforeSelectedDate = new Date(selectedDate);
    dayBeforeSelectedDate.setDate(selectedDate.getDate() - 1);

    const query = `
    WITH SalesData AS (
      SELECT 
        TO_CHAR(DATE(order_date), 'YYYY-MM-DD') AS sale_date,
        SUM(total_amount) AS total_sales,
        currency_symbol
      FROM 
        vendorproductorder
      WHERE
        vendor_id = $1
        AND DATE(order_date) BETWEEN $3 AND $2
      GROUP BY 
        sale_date, currency_symbol
    )
    SELECT 
      sale_date,
      TO_CHAR((DATE(sale_date::date) - interval '1 day'), 'YYYY-MM-DD') AS day_before_sale_date,
      SUM(CASE WHEN sale_date::date = $2 THEN total_sales ELSE 0 END) AS total_sale_today,
      SUM(CASE WHEN sale_date::date = $3 THEN total_sales ELSE 0 END) AS day_before_sale,
      currency_symbol
    FROM 
      SalesData
    WHERE 
      sale_date::date = $2 OR sale_date::date = $3
    GROUP BY 
      sale_date, currency_symbol
    ORDER BY 
      currency_symbol, sale_date;
    
    
    `;

    const { rows } = await pool.query(query, [
      vendor_id,
      selectedDate,
      dayBeforeSelectedDate,
    ]);

    res.json(rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/completedOrders/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  const { date } = req.query;
  try {
    const query = `
      SELECT
        TO_CHAR(order_date, 'YYYY-MM-DD') AS custom_month,
        COUNT(*) AS total_completed_paid_orders
    FROM
        vendorproductorder
    WHERE
        order_status = 'Delivered'
        AND payment_status = 'Paid'
        AND TO_CHAR(order_date, 'YYYY-MM-DD') = $2 
        AND vendor_id = $1 
    GROUP BY
        TO_CHAR(order_date, 'YYYY-MM-DD');
    
    `;

    const { rows } = await pool.query(query, [vendor_id, date]);

    res.json(rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/scrape-exchange-rate", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: 'Both "from" and "to" currencies are required' });
    }

    const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const resultElement = $(".result__BigRate-sc-1bsijpp-1");
    const exchangeRate = resultElement.text().trim(); // Trim any extra whitespace

    res.json({ exchangeRate });
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
});

// Endpoint to get total purchases by month
app.get("/total-purchases/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  try {
    // const query = `
    //   SELECT t1.month_start,
    //     t1.order_year,
    //     t1.total_purchases,
    //     SUM(t2.total_purchases) AS total_yearpurchase
    //   FROM (
    //       SELECT TO_CHAR(DATE_TRUNC('month', o.order_date), 'Mon YYYY') AS month_start,
    //             EXTRACT(YEAR FROM o.order_date) AS order_year,
    //             COUNT(*) AS total_purchases
    //       FROM vendorproductorder o
    //       WHERE o.vendor_id = $1
    //       GROUP BY TO_CHAR(DATE_TRUNC('month', o.order_date), 'Mon YYYY'), EXTRACT(YEAR FROM o.order_date)
    //   ) AS t1
    //   JOIN (
    //       SELECT EXTRACT(YEAR FROM o.order_date) AS year,
    //             COUNT(*) AS total_purchases
    //       FROM vendorproductorder o
    //       WHERE o.vendor_id = $1
    //       GROUP BY EXTRACT(YEAR FROM o.order_date)
    //   ) AS t2 ON t1.order_year = t2.year
    //   GROUP BY t1.month_start, t1.order_year, t1.total_purchases
    //   ORDER BY t1.month_start, t1.order_year;
    // `;

    const query = `
      SELECT
        TO_CHAR(DATE_TRUNC('MONTH', o.order_date), 'Mon YYYY') AS month_start,
        EXTRACT(YEAR FROM o.order_date) AS order_year,
        COUNT(o.order_id) AS total_purchases,
        SUM(COUNT(o.order_id)) OVER (PARTITION BY EXTRACT(YEAR FROM o.order_date)) AS total_yearpurchase
      FROM 
        orders o
      WHERE 
      EXISTS (
          SELECT 1
          FROM orderitems oi
          LEFT JOIN products p ON p.product_id = oi.product_id
          WHERE oi.order_id = o.order_id
          AND p.vendor_id = $1
        )
      GROUP BY
        month_start, order_year;
      `;

    const { rows } = await pool.query(query, [vendor_id]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.post("/payment-in-metrics", async (req, res) => {
  const { type, vendorId } = req.body;

  try {
    let query = `
      WITH PaymentMetrics AS (
        SELECT
            TO_CHAR(DATE_TRUNC('month', order_date), 'Mon YYYY') AS month_start,
            currency_symbol,
            SUM(CASE WHEN payment_status = 'Paid' THEN total_amount::numeric ELSE 0 END) AS completed_payments,
            SUM(CASE WHEN payment_status IS NULL THEN total_amount::numeric ELSE 0 END) AS pending_payments
        FROM
            vendorproductorder
        WHERE vendor_id = $1
        GROUP BY
            month_start, currency_symbol
      )
      SELECT
          month_start,
          currency_symbol,
          completed_payments,
          pending_payments,
          completed_payments + pending_payments AS total_payment_in
      FROM
          PaymentMetrics
      ORDER BY
          month_start, currency_symbol;
    `;

    if (type === "admin") {
      // If type is "admin", remove the WHERE clause
      query = `
        WITH PaymentMetrics AS (
          SELECT
              TO_CHAR(DATE_TRUNC('month', order_date), 'Mon YYYY') AS month_start,
              currency_symbol,
              SUM(CASE WHEN payment_status = 'Paid' THEN total_amount::numeric ELSE 0 END) AS completed_payments,
              SUM(CASE WHEN payment_status IS NULL THEN total_amount::numeric ELSE 0 END) AS pending_payments
          FROM
              vendorproductorder
          GROUP BY
              month_start, currency_symbol
        )
        SELECT
            month_start,
            currency_symbol,
            completed_payments,
            pending_payments,
            completed_payments + pending_payments AS total_payment_in
        FROM
            PaymentMetrics
        ORDER BY
            month_start, currency_symbol;
      `;
    }

    const { rows } = await pool.query(query, type == "admin" ? [] : [vendorId]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching payment in metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/payment-out-metrics", async (req, res) => {
  const { type, vendorId } = req.body; // Assuming the type is passed as a query parameter

  try {
    let query = `
      WITH PaymentOutMetrics AS (
        SELECT
            TO_CHAR(DATE_TRUNC('month', order_date), 'Mon YYYY') AS month_start,
            currency_symbol,
            SUM(CASE WHEN payment_status = 'Paid' THEN commission_fee::numeric ELSE 0 END) AS total_commission_fee,
            SUM(CASE WHEN payment_status = 'Paid' THEN withdrawal_amount::numeric ELSE 0 END) AS total_withdrawal_amount,
            SUM(CASE WHEN payment_status = 'Refunded' THEN refund_amount::numeric ELSE 0 END) AS total_refund_amount
        FROM
            vendorproductorder
    `;

    if (type !== "admin") {
      query += `
        WHERE
            vendor_id = $1 AND payment_status IN ('Paid', 'Refunded')
      `;
    }

    query += `
        GROUP BY
            month_start, currency_symbol
      )
      SELECT
          month_start,
          currency_symbol,
          total_commission_fee,
          total_withdrawal_amount,
          total_refund_amount,
          total_commission_fee + total_withdrawal_amount - total_refund_amount AS total_payment_out
      FROM
          PaymentOutMetrics
      ORDER BY
          month_start, currency_symbol;
    `;

    const { rows } = await pool.query(
      query,
      type !== "admin" ? [vendorId] : []
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching payment out metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/currentorders/:vendor_id", async (req, res) => {
  const { vendor_id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  try {
    // Use a prepared statement to avoid SQL injection
    const query = {
      // text: "SELECT * FROM vendorproductorder WHERE vendor_id = $1 AND DATE(order_date) = $2",
      text: `
      SELECT *
      FROM orders o
      WHERE 
        DATE(o.order_date) = $2
        AND EXISTS (
          SELECT 1
          FROM orderitems oi
          LEFT JOIN products p ON p.product_id = oi.product_id
          WHERE oi.order_id = o.order_id
          AND p.vendor_id = $1
        )
      `,
      values: [vendor_id, date],
    };

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
});

app.get("/salesByCategory/:vendor_id", async (req, res) => {
  try {
    const { vendor_id } = req.params;

    // Use a prepared statement to avoid SQL injection
    const query = {
      text: `
        SELECT
          vendor_id,
          category,
          subcategory,
          currency_symbol,
          COUNT(*) AS sales_count,
          SUM(CAST(total_amount AS numeric)) AS total_sales_amount
        FROM
          vendorproductorder
        WHERE
          vendor_id = $1
        GROUP BY
          vendor_id,
          category,
          subcategory,
          currency_symbol
        ORDER BY
          vendor_id,
          subcategory,
          currency_symbol,
          category;
      `,
      values: [vendor_id],
    };

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
});

app.get("/customer-count", async (req, res) => {
  try {
    const query = `
      SELECT
        CASE
          WHEN status = 0 THEN 'Pending'
          WHEN status = 1 THEN 'Blocked'
          WHEN status = 2 THEN 'Archived'
          WHEN status = 3 THEN 'Approved'
          WHEN status = 4 THEN 'Rejected'
        END AS status,
        COUNT(*) AS count
      FROM
        customers
      WHERE
        status IN (0, 1, 2, 3, 4)
      GROUP BY
        status;
    `;

    const { rows } = await pool.query(query);
    const counts = {
      Total: 0, // Initialize total count to 0
      Pending: 0,
      Blocked: 0,
      Archived: 0,
      Approved: 0,
      Rejected: 0,
    };

    // Update counts object with the retrieved counts
    rows.forEach((row) => {
      counts[row.status] = parseInt(row.count);
      counts.Total += parseInt(row.count); // Increment total count
    });

    res.json(counts);
  } catch (error) {
    console.error("Error fetching customer count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/vendor-count", async (req, res) => {
  try {
    const query = `
      SELECT
        CASE
          WHEN status = 0 THEN 'Pending'
          WHEN status = 1 THEN 'Blocked'
          WHEN status = 2 THEN 'Archived'
          WHEN status = 3 THEN 'Approved'
          WHEN status = 4 THEN 'Rejected'
        END AS status,
        COUNT(*) AS count
      FROM
        vendors
      WHERE
        status IN (0, 1, 2, 3, 4)
      GROUP BY
        status;
    `;

    const { rows } = await pool.query(query);
    const counts = {
      Total: 0, // Initialize total count to 0
      Pending: 0,
      Blocked: 0,
      Archived: 0,
      Approved: 0,
      Rejected: 0,
    };

    // Update counts object with the retrieved counts
    rows.forEach((row) => {
      counts[row.status] = parseInt(row.count);
      counts.Total += parseInt(row.count); // Increment total count
    });

    res.json(counts);
  } catch (error) {
    console.error("Error fetching vendor count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/chart-data", async (req, res) => {
  try {
    const selectedYear = req.query.year; // Get the selected year from the request query parameters
    const query = `
      SELECT
        TO_CHAR(order_date, 'Mon DD, YYYY') AS date,
        COUNT(*) AS TotalOrders,
        SUM(total_amount) AS Revenue,
        currency_symbol
      FROM
        vendorproductorder
      WHERE
        EXTRACT(YEAR FROM order_date::date) = $1
      GROUP BY
        date, currency_symbol
      ORDER BY
        date;
    `;

    const { rows } = await pool.query(query, [selectedYear]);
    const chartData = rows.map((row) => ({
      date: row.date,
      TotalOrders: parseInt(row.totalorders),
      Revenue: parseInt(row.revenue),
      currency_symbol: row.currency_symbol,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

app.post("/manageStatus", async (req, res) => {
  try {
    const { order_id, status, vendorId } = req.body;
    const date = new Date(); // Replace this with your date object
    const formattedDate = `${date.getFullYear()}-${padZero(
      date.getMonth() + 1
    )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}:${padZero(date.getSeconds())}`;

    // Update the order_status in the database
    const updateResult = await pool.query(
      "UPDATE vendorproductorder SET order_status = $1 WHERE order_id = $2",
      [status, order_id]
    );

    if (updateResult.rowCount > 0) {
      // Order status updated successfully, now insert a notification
      const notificationResult = await pool.query(
        "INSERT INTO vendors_notifications (vendor_id, type, title, message, date) VALUES ($1, $2, $3, $4, $5)",
        [
          vendorId,
          `Orders`,
          `Order ${status}`,
          `Order #${order_id} has been updated to ${status}.`,
          formattedDate,
        ]
      );

      if (notificationResult.rowCount > 0) {
        res.status(200).json({
          message:
            "Order status updated successfully and notification inserted",
        });
      } else {
        res.status(400).json({ message: "Failed to insert notification" });
      }
    } else {
      res.status(400).json({ message: "Failed to update order status" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/sales-and-returns", async (req, res) => {
  try {
    const { vendor_id } = req.body; // Get vendor_id from the request body

    // Your SQL query
    const query = `
      SELECT
        CAST("order_id" AS INT) AS "key",
        "product_name" AS "productName",
        "order_date" AS "saleDate",
        "product_uniqueid" AS "pid",
        CAST("total_amount" AS NUMERIC) AS "amountSold",
        CAST("fees_paid" AS NUMERIC) AS "fees",
        CAST("tax_collected" AS NUMERIC) AS "taxes",
        currency_symbol,
        COUNT(CASE WHEN "order_status" = 'Refunded' THEN 1 ELSE NULL END) AS "returns"
    FROM
        vendorproductorder
    WHERE
        vendor_id = $1
        AND "order_status" IN ('Delivered', 'Refunded')
        AND "payment_status" = 'Paid'
    GROUP BY
        "key", "productName", "saleDate", "product_uniqueid", "amountSold", "fees", "taxes", currency_symbol;
    `;

    const { rows } = await pool.query(query, [vendor_id]); // Execute the query with vendor_id

    res.json(rows); // Send the query result as JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = app;
