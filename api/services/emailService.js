const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
// ...existing code...

class EmailService {
  constructor() {
    this.transporter = null;
    this.useSendGrid = false;
    this.setupTransporter();
  }

  setupTransporter() {
    // Configure based on environment and available services
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid if API key is available
      this.useSendGrid = true;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('📧 SendGrid email service configured');
    } else if (process.env.NODE_ENV === 'production') {
      // Fallback production email service
      this.transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      console.log('📧 Production email service configured (Nodemailer)');
    } else {
      // Development - use Ethereal Email for testing
      this.setupEtherealEmail();
    }
  }

  async setupEtherealEmail() {
    try {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      console.log('📧 Development email setup complete');
      console.log('   Ethereal Email User:', testAccount.user);
      console.log('   Ethereal Email Pass:', testAccount.pass);
      console.log('   Preview emails at: https://ethereal.email');
    } catch (error) {
      console.error('Failed to setup Ethereal email:', error);
      // Fallback to console logging
      this.transporter = null;
    }
  }

  async sendVerificationEmail(email, username, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Cardboard Garden" <${process.env.EMAIL_FROM || 'noreply@cardboard.garden'}>`,
      to: email,
      subject: 'Welcome to Cardboard Garden - Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Cardboard Garden</title>
          <link href="https://fonts.googleapis.com/css2?family=Qilka:wght@400;700;800&family=Inter:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Qilka', 'Inter', Arial, sans-serif;
              background: #0F0F0F;
              color: #E5E7EB;
              line-height: 1.6;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 32px 20px;
              background: #1A1A1A;
              border-radius: 16px;
              box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
            }
            .header {
              background: linear-gradient(90deg, #4A7C2A 0%, #D4AC0D 100%);
              padding: 24px 0 16px 0;
              text-align: center;
              border-radius: 12px 12px 0 0;
            }
            .header h1 {
              color: #F3F4F6;
              font-family: 'Qilka', 'Montserrat', 'Inter', sans-serif;
              font-weight: 800;
              font-size: 2.25rem;
              margin: 0 0 4px 0;
              letter-spacing: 1px;
            }
            .header p {
              color: #D4AC0D;
              font-size: 1.1rem;
              margin: 0;
              font-weight: 500;
            }
            .content {
              background: #2D2D2D;
              padding: 28px 20px;
              border-radius: 0 0 12px 12px;
              margin: 0;
            }
            .verify-button {
              display: inline-block;
              background: linear-gradient(90deg, #4A7C2A 0%, #D4AC0D 100%);
              color: #0F0F0F;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1.1rem;
              margin: 24px 0;
              box-shadow: 0 2px 8px 0 rgba(212,172,13,0.15);
              transition: background 0.2s;
            }
            .verify-button:hover {
              background: linear-gradient(90deg, #5B8B36 0%, #FFD700 100%);
              color: #000;
            }
            .footer {
              text-align: center;
              color: #9CA3AF;
              font-size: 13px;
              margin-top: 32px;
            }
            .link-box {
              word-break: break-all;
              background: #1A1A1A;
              color: #D4AC0D;
              padding: 12px;
              border-radius: 6px;
              font-size: 0.98rem;
              margin: 12px 0;
              border: 1px solid #D4AC0D;
            }
            ul {
              color: #D1D5DB;
              margin: 16px 0 0 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 6px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🃏 Cardboard Garden</h1>
              <p>Magic: The Gathering Collection Manager</p>
            </div>
            <div class="content">
              <h2 style="color:#F3F4F6; font-family:'Qilka','Inter',sans-serif; font-weight:700;">Welcome, ${username}!</h2>
              <p>Thank you for joining Cardboard Garden, your personal Magic: The Gathering collection manager.</p>
              <p>To get started and access your collection, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <div class="link-box">${verificationUrl}</div>
              <p><strong style="color:#D4AC0D;">This verification link will expire in 24 hours.</strong></p>
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>🔍 Search through thousands of Magic cards</li>
                <li>📚 Build and manage your personal collection</li>
                <li>🎯 Track card variations and alternative names</li>
                <li>🔄 View both sides of double-faced cards</li>
              </ul>
            </div>
            <div class="footer">
              <p>If you didn't create an account with Cardboard Garden, please ignore this email.</p>
              <p>This email was sent from Cardboard Garden Collection Manager</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Cardboard Garden, ${username}!
        
        Thank you for joining our Magic: The Gathering collection manager.
        
        To verify your email address and activate your account, please visit:
        ${verificationUrl}
        
        This verification link will expire in 24 hours.
        
        If you didn't create an account with Cardboard Garden, please ignore this email.
      `
    };

    return this.sendEmail(mailOptions);
  }

  async sendPasswordResetEmail(email, username, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Cardboard Garden" <${process.env.EMAIL_FROM || 'noreply@cardboard.garden'}>`,
      to: email,
      subject: 'Cardboard Garden - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - Cardboard Garden</title>
          <link href="https://fonts.googleapis.com/css2?family=Qilka:wght@400;700;800&family=Inter:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Qilka', 'Inter', Arial, sans-serif;
              background: #0F0F0F;
              color: #E5E7EB;
              line-height: 1.6;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 32px 20px;
              background: #1A1A1A;
              border-radius: 16px;
              box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
            }
            .header {
              background: linear-gradient(90deg, #4A7C2A 0%, #D4AC0D 100%);
              padding: 24px 0 16px 0;
              text-align: center;
              border-radius: 12px 12px 0 0;
            }
            .header h1 {
              color: #F3F4F6;
              font-family: 'Qilka', 'Montserrat', 'Inter', sans-serif;
              font-weight: 800;
              font-size: 2.25rem;
              margin: 0 0 4px 0;
              letter-spacing: 1px;
            }
            .header p {
              color: #D4AC0D;
              font-size: 1.1rem;
              margin: 0;
              font-weight: 500;
            }
            .content {
              background: #2D2D2D;
              padding: 28px 20px;
              border-radius: 0 0 12px 12px;
              margin: 0;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(90deg, #4A7C2A 0%, #D4AC0D 100%);
              color: #0F0F0F;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1.1rem;
              margin: 24px 0;
              box-shadow: 0 2px 8px 0 rgba(212,172,13,0.15);
              transition: background 0.2s;
            }
            .reset-button:hover {
              background: linear-gradient(90deg, #5B8B36 0%, #FFD700 100%);
              color: #000;
            }
            .footer {
              text-align: center;
              color: #9CA3AF;
              font-size: 13px;
              margin-top: 32px;
            }
            .link-box {
              word-break: break-all;
              background: #1A1A1A;
              color: #D4AC0D;
              padding: 12px;
              border-radius: 6px;
              font-size: 0.98rem;
              margin: 12px 0;
              border: 1px solid #D4AC0D;
            }
            .warning {
              background: #2D2D2D;
              border: 1px solid #F59E0B;
              color: #F59E0B;
              padding: 12px;
              border-radius: 6px;
              margin: 10px 0 18px 0;
              font-size: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🃏 Cardboard Garden</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2 style="color:#F3F4F6; font-family:'Qilka','Inter',sans-serif; font-weight:700;">Hello, ${username}</h2>
              <p>We received a request to reset your password for your Cardboard Garden account.</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </div>
              <p>To reset your password, click the button below:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <div class="link-box">${resetUrl}</div>
              <p><strong style="color:#D4AC0D;">This password reset link will expire in 1 hour.</strong></p>
            </div>
            <div class="footer">
              <p>This email was sent from Cardboard Garden Collection Manager</p>
              <p>For security reasons, this link can only be used once.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Cardboard Garden
        
        Hello ${username},
        
        We received a request to reset your password for your Cardboard Garden account.
        
        To reset your password, please visit:
        ${resetUrl}
        
        This password reset link will expire in 1 hour.
        
        If you didn't request this password reset, please ignore this email.
      `
    };

    return this.sendEmail(mailOptions);
  }

  async sendEmail(mailOptions) {
    try {
      if (this.useSendGrid) {
        // Use SendGrid
        const msg = {
          to: mailOptions.to,
          from: mailOptions.from,
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text
        };

        const result = await sgMail.send(msg);
        console.log('📧 Email sent successfully via SendGrid');
        console.log('Message ID:', result[0].headers['x-message-id']);
        
        return { 
          success: true, 
          messageId: result[0].headers['x-message-id'],
          service: 'SendGrid'
        };
      } else if (this.transporter) {
        // Use Nodemailer (Ethereal/Gmail/etc)
        const info = await this.transporter.sendMail(mailOptions);
        
        console.log('📧 Email sent successfully via Nodemailer:');
        console.log('Message ID:', info.messageId);
        
        // For development with Ethereal Email
        if (process.env.NODE_ENV !== 'production') {
          console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        
        return { 
          success: true, 
          messageId: info.messageId, 
          previewUrl: nodemailer.getTestMessageUrl(info),
          service: 'Nodemailer'
        };
      } else {
        // Fallback to console logging in development
        console.log('📧 Email would be sent:');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Preview:', mailOptions.text);
        return { success: true, messageId: 'console-fallback', service: 'Console' };
      }
    } catch (error) {
      console.error('📧 Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
