import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Backend running ✅"));

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  // Log incoming request (so Render logs show data)
  console.log("FORM DATA:", { name, email, message });

  // Validate
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // Validate required env variables exist
    const required = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "FROM_EMAIL",
      "TO_EMAIL",
    ];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      console.log("MISSING ENV:", missing);
      return res.status(500).json({ error: "Missing env vars", missing });
    }

    // Mailtrap SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,                 // sandbox.smtp.mailtrap.io
      port: Number(process.env.SMTP_PORT),         // 2525
      secure: false,                               // IMPORTANT for 2525
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // prevents hanging
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    // Verify SMTP first (so if creds wrong, you see exact error)
    await transporter.verify();
    console.log("SMTP VERIFY ✅");

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,   // ex: contact@demo.com
      to: process.env.TO_EMAIL,       // ex: noreply@demo.com
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("MAIL SENT ✅");
    return res.status(200).json({ success: true, message: "Email sent" });

  } catch (err) {
    console.error("MAIL ERROR ❌", err);
    return res.status(500).json({
      error: "Mail failed",
      details: err?.message || String(err),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on", PORT));
