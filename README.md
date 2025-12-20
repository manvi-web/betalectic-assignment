# Betalectic Assignment – Contact Form Website

## Project Overview
This project is a responsive 3-page website built as part of the Betalectic assignment.

The website contains:
- Home Page
- Why Us Page
- Contact Us Page

The Contact Us page submits form data to a Node.js backend, which uses Nodemailer to generate email notifications.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Email: Nodemailer with Mailtrap (Email Testing)
- Hosting:
  - Frontend: Vercel
  - Backend: Render

## Live URLs
- Frontend: https://betalectic-assignment-khaki.vercel.app/
- Backend: https://betalectic-assignment-1.onrender.com

## Email Handling
Nodemailer is integrated in the backend to handle contact form submissions.
Mailtrap SMTP sandbox is used as a testing inbox to safely verify email delivery in a cloud environment.

## How to Test
1. Open the frontend live URL.
2. Navigate to the Contact Us page.
3. Fill and submit the contact form.
4. Email will be visible in the Mailtrap Sandbox inbox.
