const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// SMTP2GO Configuration
const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 587,
    auth: {
        user: 'YOUR_SMTP2GO_USERNAME', // Replace with your SMTP2GO username
        pass: 'YOUR_SMTP2GO_PASSWORD', // Replace with your SMTP2GO password
    },
});

// Email Sending Endpoint
app.post('/send-email', (req, res) => {
    const { name, email, address, payment, referenceNumber } = req.body;

    const mailOptions = {
        from: 'your-email@example.com', // Replace with your email
        to: email,
        subject: 'Purchase Confirmation',
        text: `Thank you for your purchase, ${name}!\n\nReference Number: ${referenceNumber}\nShipping Address: ${address}\nPayment Method: ${payment}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.json({ success: false });
        }
        console.log('Email sent:', info.response);
        res.json({ success: true });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});