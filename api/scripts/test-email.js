#!/usr/bin/env node
/**
 * Email Service Test Script
 * Tests the email service with current configuration
 */

const emailService = require('../services/emailService.js');

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');
  
  // Wait a moment for Ethereal setup to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    console.log('📧 Testing verification email...');
    const result = await emailService.sendVerificationEmail(
      'test@example.com',
      'TestUser',
      'test-verification-token-123'
    );
    
    console.log('\n✅ Email Test Results:');
    console.log('Success:', result.success);
    console.log('Service:', result.service || 'Unknown');
    console.log('Message ID:', result.messageId);
    
    if (result.previewUrl) {
      console.log('Preview URL:', result.previewUrl);
      console.log('\n💡 Tip: Visit the preview URL to see the email in browser!');
    }
    
    if (result.success) {
      console.log('\n🎉 Email service is working correctly!');
      console.log('✅ Ready for SendGrid integration when you add API key');
    } else {
      console.log('\n❌ Email service needs attention');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Email test failed:', error.message);
  }
}

// Run the test
testEmailService();
