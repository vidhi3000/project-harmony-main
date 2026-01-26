// Test Gmail SMTP connection
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-16-char-app-password' // Replace with App Password from Step 1
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP Connection Failed:', error);
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('Ready to send emails');
  }
});
