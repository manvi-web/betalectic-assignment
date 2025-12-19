const express = require("express");
const nodemailer = require("nodemailer");

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => res.send("Backend is running"));

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  try {
 
    const user = process.env.EMAIL_USER || "manvirao38@gmail.com";
    const pass = process.env.EMAIL_PASS || "yasd tzmc tiaj exnr";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,        
      replyTo: email,      
      to: user,           
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.send("Email sent successfully");
  } catch (err) {
    console.error("EMAIL ERROR:", err); 
    res.status(500).send("Email failed");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
