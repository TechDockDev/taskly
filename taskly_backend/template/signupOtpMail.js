const emailVerificationTemplate = ({ userName, otp}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #F4F4F4;
        color: #333;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
        text-align: center;
        margin-bottom: 20px;
    }
    .logo img {
        max-width: 150px;
    }
    .header {
        text-align: center;
        background-color: #0056D2;
        color: #FFFFFF;
        padding: 20px;
        border-radius: 8px 8px 0 0;
    }
    .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #0056D2;
        text-align: center;
        margin: 20px 0;
    }
    .message {
        font-size: 16px;
        text-align: center;
        margin: 20px 0;
    }
    .button {
        display: inline-block;
        background-color: #FFD700;
        color: #0056D2;
        padding: 12px 24px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        margin: 20px auto;
    }
    .footer {
        font-size: 12px;
        color: #777;
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #E0E0E0;
    }
    .footer a {
        color: #0056D2;
        text-decoration: none;
    }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="cid:logoImage" alt="Taskly Logo">
        </div>
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="message">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Thank you for signing up with <strong>Taskly</strong>!</p>
          <p>Please use the OTP below to verify your email address:</p>
        </div>
        <div class="otp">${otp}</div>
        <div class="message">
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>You received this email because you signed up for Taskly.</p>
          <p><a href="https://yourdomain.com/privacy-policy">Privacy Policy</a></p>
          <p>&copy; 2025 Taskly. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};

export default emailVerificationTemplate;
