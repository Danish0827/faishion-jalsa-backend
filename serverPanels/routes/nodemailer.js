const nodemailer = require("nodemailer");

// Create a function to send emails
const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: "ks615044@gmail.com", // Update with your Gmail email
        pass: "vbgabjbjxwyahlji", // Update with your Gmail password or an app-specific password
      },
    });

    let message = {
      from: '"Fashion Jalsa" <ks615044@gmail.com>', // Add both name and email address
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(message);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Example usage:
// sendEmail('recipient@example.com', 'Test Email', 'This is a test email.');

module.exports = sendEmail;
