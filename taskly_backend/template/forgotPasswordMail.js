const forgotPasswordTemplate = ({resetLink}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f2f4f6;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      }
      .email-header {
        background-color: #004aad;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .email-header h1 {
        margin: 0;
        font-size: 24px;
      }
      .email-body {
        padding: 30px 20px;
      }
      .email-body h2 {
        font-size: 20px;
        margin-top: 0;
        color: #004aad;
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.6;
        margin: 15px 0;
      }
      .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 14px 28px;
        background-color: #004aad;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 6px;
        transition: background-color 0.3s ease;
      }
      .cta-button:hover {
        background-color: #00317f;
      }
      .fallback-text {
        margin-top: 40px;
        font-size: 13px;
        color: #555;
        word-break: break-all;
      }
      .email-footer {
        text-align: center;
        font-size: 13px;
        color: #999;
        padding: 20px;
        background-color: #f9fafb;
      }
      @media only screen and (max-width: 600px) {
        .email-body, .email-header, .email-footer {
          padding: 20px 15px;
        }
        .cta-button {
          width: 100%;
          text-align: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Taskly Account Security</h1>
      </div>
      <div class="email-body">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password associated with your <strong>Taskly</strong> account.</p>
        <p>Click the button below to set a new password:</p>
        <p style="text-align: center;">
          <a href=${resetLink} class="cta-button" target="_blank">Reset My Password</a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.</p>
        <div class="fallback-text">
          <strong>Can’t click the button?</strong><br />
          Copy and paste this link into your browser:<br />
          <a href="${resetLink}" style="color: #004aad;">${resetLink}</a>
        </div>
      </div>
      <div class="email-footer">
        &copy; 2025 Taskly. All rights reserved.<br />
        Need help? Contact us at <a href="mailto:support@example.com" style="color:#004aad;">support@example.com</a>
      </div>
    </div>
  </body>
</html>

    `
}

export default forgotPasswordTemplate;
