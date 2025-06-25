require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());


// temporary no-op transporter until you configure real SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',        // Gmail SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,  // Placeholder for your Gmail address
    pass: process.env.EMAIL_PASS,  // Placeholder for your App Password
  },
});

// Health check
app.get('/', (_req, res) => res.send('Mail API server running.'));

app.post('/api/send-email', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message required.' });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  const mailOptions = {
    from: `${fullName} <${email}>`,
    to: process.env.TARGET_EMAIL || 'placeholder@nowhere.com',
    subject: `[Contact Form] ${subject || 'No subject'}`,
    text: `
Name: ${fullName}
Email: ${email}

${message}
    `,
    html: `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p>${message}</p>
    `,
  };

  try {
    // We won't send yet, just simulate
    console.log('Simulated send:', mailOptions);
    res.json({ success: true, simulated: true });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mail API server listening on port ${PORT}`));


