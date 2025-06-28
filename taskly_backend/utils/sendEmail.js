import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, htmlContent }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to:email,
    subject,
    html: htmlContent
  });
};
