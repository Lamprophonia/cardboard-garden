const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

class EmailService {
  constructor() {
    this.transporter = null;
    this.setupTransporter();
  }

  setupTransporter() {
    // Configure based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production email service (e.g., SendGrid, AWS SES, etc.)
      this.transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
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
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #d4af37, #ffd700); padding: 20px; text-align: center; border-radius: 8px; }
            .header h1 { color: #000; margin: 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .verify-button { 
              display: inline-block; 
              background: linear-gradient(45deg, #d4af37, #ffd700); 
              color: #000; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🃏 Cardboard Garden</h1>
              <p>Magic: The Gathering Collection Manager</p>
            </div>
            
            <div class="content">
              <h2>Welcome, ${username}!</h2>
              <p>Thank you for joining Cardboard Garden, your personal Magic: The Gathering collection manager.</p>
              
              <p>To get started and access your collection, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 4px;">
                ${verificationUrl}
              </p>
              
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              
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
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #d4af37, #ffd700); padding: 20px; text-align: center; border-radius: 8px; }
            .header h1 { color: #000; margin: 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .reset-button { 
              display: inline-block; 
              background: linear-gradient(45deg, #e74c3c, #c0392b); 
              color: #fff; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🃏 Cardboard Garden</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2>Hello, ${username}</h2>
              <p>We received a request to reset your password for your Cardboard Garden account.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </div>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <p><strong>This password reset link will expire in 1 hour.</strong></p>
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
    if (!this.transporter) {
      // Fallback to console logging in development
      console.log('📧 Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Preview:', mailOptions.text);
      return { success: true, messageId: 'console-fallback' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('📧 Email sent successfully:');
      console.log('Message ID:', info.messageId);
      
      // For development with Ethereal Email
      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
      console.error('📧 Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
