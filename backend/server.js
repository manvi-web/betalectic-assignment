import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every request (so you see it in Render logs)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url, req.body);
  next();
});

app.get("/", (req, res) => res.send("Backend is running ✅"));

function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("SMTP_TIMEOUT")), ms)),
  ]);
}

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("ENV MISSING:", {
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS,
      });
      return res.status(500).json({ error: "Missing EMAIL_USER/EMAIL_PASS in Render env" });
    }

    // Gmail (most reliable config)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password only
      },
      // hard timeouts so request never hangs forever
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    // Verify quickly (prints real reason if auth/tls fails)
    await withTimeout(transporter.verify(), 15000);

    await withTimeout(
      transporter.sendMail({
        from: `"Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Contact Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }),
      15000
    );

    console.log("MAIL SENT ✅");
    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("MAIL ERROR ❌:", err?.message || err, err);
    if (err?.message === "SMTP_TIMEOUT") {
      return res.status(504).json({ error: "SMTP timeout (Gmail not responding from Render)" });
    }
    return res.status(500).json({ error: "Mail failed", details: err?.message || String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));

