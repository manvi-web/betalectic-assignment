const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    res.send("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Email not sent");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
