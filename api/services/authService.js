const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const emailService = require('./emailService');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    this.SALT_ROUNDS = 12;
  }

  async getDbConnection() {
    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'cardboard_garden',
      charset: 'utf8mb4'
    });
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId) {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async registerUser(username, email, password) {
    const db = await this.getDbConnection();
    
    try {
      // Check if user already exists
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers.length > 0) {
        return { success: false, error: 'Username or email already exists' };
      }

      // Hash password and generate verification token
      const passwordHash = await this.hashPassword(password);
      const verificationToken = this.generateSecureToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert new user
      const [result] = await db.execute(
        `INSERT INTO users (username, email, password_hash, email_verification_token, email_verification_expires) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, email, passwordHash, verificationToken, verificationExpires]
      );

      const userId = result.insertId;

      // Send verification email
      const emailResult = await emailService.sendVerificationEmail(email, username, verificationToken);

      if (!emailResult.success) {
        console.warn('Failed to send verification email:', emailResult.error);
      }

      return {
        success: true,
        userId,
        message: 'Registration successful. Please check your email to verify your account.',
        emailSent: emailResult.success,
        previewUrl: emailResult.previewUrl // For development
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      await db.end();
    }
  }

  async loginUser(usernameOrEmail, password) {
    const db = await this.getDbConnection();
    
    try {
      // Find user by username or email
      const [users] = await db.execute(
        'SELECT id, username, email, password_hash, is_active, email_verified FROM users WHERE username = ? OR email = ?',
        [usernameOrEmail, usernameOrEmail]
      );

      if (users.length === 0) {
        return { success: false, error: 'Invalid credentials' };
      }

      const user = users[0];

      // Check password
      const isPasswordValid = await this.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if email is verified
      if (!user.email_verified) {
        return { 
          success: false, 
          error: 'Please verify your email address before logging in',
          needsVerification: true 
        };
      }

      // Check if account is active
      if (!user.is_active) {
        return { success: false, error: 'Account is deactivated. Please contact support.' };
      }

      // Update last login
      await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      // Generate JWT token
      const token = this.generateToken(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      await db.end();
    }
  }

  async verifyEmail(token) {
    const db = await this.getDbConnection();
    
    try {
      // Find user with this verification token
      const [users] = await db.execute(
        'SELECT id, username, email, email_verification_expires FROM users WHERE email_verification_token = ?',
        [token]
      );

      if (users.length === 0) {
        return { success: false, error: 'Invalid verification token' };
      }

      const user = users[0];

      // Check if token has expired
      if (new Date() > new Date(user.email_verification_expires)) {
        return { success: false, error: 'Verification token has expired', expired: true };
      }

      // Update user as verified and active
      await db.execute(
        `UPDATE users 
         SET email_verified = TRUE, is_active = TRUE, email_verification_token = NULL, email_verification_expires = NULL 
         WHERE id = ?`,
        [user.id]
      );

      // Create user preferences record
      await db.execute(
        'INSERT INTO user_preferences (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = user_id',
        [user.id]
      );

      return {
        success: true,
        message: 'Email verified successfully! You can now log in.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };

    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Verification failed. Please try again.' };
    } finally {
      await db.end();
    }
  }

  async resendVerificationEmail(email) {
    const db = await this.getDbConnection();
    
    try {
      // Find user by email
      const [users] = await db.execute(
        'SELECT id, username, email, email_verified FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return { success: false, error: 'Email address not found' };
      }

      const user = users[0];

      if (user.email_verified) {
        return { success: false, error: 'Email is already verified' };
      }

      // Generate new verification token
      const verificationToken = this.generateSecureToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with new token
      await db.execute(
        'UPDATE users SET email_verification_token = ?, email_verification_expires = ? WHERE id = ?',
        [verificationToken, verificationExpires, user.id]
      );

      // Send verification email
      const emailResult = await emailService.sendVerificationEmail(email, user.username, verificationToken);

      return {
        success: emailResult.success,
        message: emailResult.success ? 
          'Verification email sent. Please check your email.' : 
          'Failed to send verification email.',
        previewUrl: emailResult.previewUrl // For development
      };

    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: 'Failed to resend verification email.' };
    } finally {
      await db.end();
    }
  }

  async getUserById(userId) {
    const db = await this.getDbConnection();
    
    try {
      const [users] = await db.execute(
        'SELECT id, username, email, created_at, last_login, is_active, email_verified FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    } finally {
      await db.end();
    }
  }
}

module.exports = new AuthService();
