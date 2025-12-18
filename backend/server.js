const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test route (optional, but good)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Contact form API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  try {
    // Mail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manvirao38@gmail.com",       
        pass: "yasd tzmc tiaj exnr"           
      }
    });

    // Mail content
    const mailOptions = {
      from: email,
      to: "manvirao38@gmail.com",           
      subject: "New Contact Form Submission",
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
