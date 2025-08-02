const EmailService = require('../services/emailService');

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    // Test 1: Register a new user
    console.log('📝 Testing user registration...');
    const registrationData = {
      email: 'test.auth@cardboard.garden',
      username: 'testauth',
      password: 'TestAuth123!',
      firstName: 'Test',
      lastName: 'Auth'
    };
    
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration response:', registerResult);
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful');
      
      // Test 2: Try to login with unverified email
      console.log('\n🔐 Testing login with unverified email...');
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usernameOrEmail: registrationData.email,
          password: registrationData.password
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login response:', loginResult);
      
      if (loginResponse.status === 403) {
        console.log('✅ Correctly blocked unverified email login');
      }
      
    } else {
      console.log('❌ Registration failed:', registerResult);
    }
    
    // Test 3: Test email service
    console.log('\n📧 Testing email service...');
    const emailService = require('../services/emailService');
    
    const emailResult = await emailService.sendVerificationEmail(
      'test@example.com',
      'Test User',
      'http://localhost:5173/verify-email?token=test123'
    );
    
    console.log('Email test result:', emailResult);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthFlow();
