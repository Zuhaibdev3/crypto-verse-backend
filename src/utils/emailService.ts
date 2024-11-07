import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email service (e.g., SMTP server)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export const sendOtpEmail = async (to: string, otp: number) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Password Reset OTP',
    text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};
