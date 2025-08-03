import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function EmailVerificationPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'success' | 'error' | 'expired'
  const [verificationMessage, setVerificationMessage] = useState('');
  const { user, resendVerification } = useAuth();
  // Removed unused navigate
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);

  // Try to get email from user context, or from query param
  let email = user?.email;
  const params = new URLSearchParams(location.search);
  if (!email) {
    email = params.get('email');
  }

  // Check for token in URL and verify if present
  useEffect(() => {
    const token = params.get('token');
    if (!token) return;

    // Debug: log the token from the URL
    console.log('[EmailVerificationPage] Token from URL:', token);

    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('Verifying your email...');

    // Helper function to handle the fetch logic
    const verifyEmail = async (baseUrl, token) => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setVerificationStatus('success');
          setVerificationMessage(data.message || 'Email verified successfully! You can now log in.');
        } else if (data.expired) {
          setVerificationStatus('expired');
          setVerificationMessage(data.error || 'Verification token has expired.');
        } else if (data.error && /already (used|verified)/i.test(data.error)) {
          setVerificationStatus('already-used');
          setVerificationMessage('This verification link has already been used. You can now sign in.');
        } else {
          setVerificationStatus('error');
          setVerificationMessage(data.error || 'Verification failed.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
        setVerificationMessage('Verification failed. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    // Dynamically import apiService to avoid circular deps
    import('../services/apiService').then(({ apiService }) => {
      apiService.ensureApiUrl().then(baseUrl => {
        verifyEmail(baseUrl, token);
      });
    });
  }, [location.search]);

  const handleResendEmail = async () => {
    if (!email) return;
    setIsResending(true);
    setResendMessage('');
    try {
      const result = await resendVerification(email);
      if (result.success) {
        setResendMessage('Verification email sent! Please check your inbox.');
      } else {
        setResendMessage(result.error || 'Failed to send verification email. Please try again.');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Helper to render the subtitle
  const renderSubtitle = () => {
    if (verificationStatus === 'success') {
      return <p className="auth-subtitle success">{verificationMessage}</p>;
    }
    if (verificationStatus === 'already-used') {
      return (
        <div className="verification-instructions">
          <h3>Already Verified</h3>
          <p>This verification link has already been used. You can now <Link to="/login">sign in</Link> to your account.</p>
        </div>
      );
    }
    if (verificationStatus === 'error' || verificationStatus === 'expired') {
      return <p className="auth-subtitle error">{verificationMessage}</p>;
    }
    if (isVerifying) {
      return <p className="auth-subtitle">{verificationMessage}</p>;
    }
    if (email) {
      return <p className="auth-subtitle">We've sent a verification link to <strong>{email}</strong></p>;
    }
    return <p className="auth-subtitle">Please check your email for a verification link.</p>;
  };

  // Helper to render the main content
  const renderContent = () => {
    if (verificationStatus === 'success') {
      return (
        <div className="verification-instructions">
          <h3>Email Verified!</h3>
          <p>Your email has been verified. You can now <Link to="/login">sign in</Link> to your account.</p>
        </div>
      );
    }
    if (verificationStatus === 'error' || verificationStatus === 'expired') {
      return (
        <div className="verification-instructions">
          <h3>Verification Failed</h3>
          <p>{verificationMessage}</p>
          <div className="verification-actions">
            <button
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="btn btn-outline btn-full"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            {resendMessage && (
              <div className={`verification-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}>
                {resendMessage}
              </div>
            )}
            {!email && (
              <div className="verification-message error">
                Unable to resend verification email: no email address found.
              </div>
            )}
          </div>
        </div>
      );
    }
    if (isVerifying) {
      return (
        <div className="verification-instructions">
          <h3>Verifying...</h3>
          <p>Please wait while we verify your email.</p>
        </div>
      );
    }
    return (
      <div className="verification-instructions">
        <h3>Check your email</h3>
        <p>
          Click the verification link in the email we sent to activate your account.
          The link will expire in 24 hours.
        </p>
        <div className="verification-steps">
          <ol>
            <li>Check your inbox for an email from Cardboard Garden</li>
            <li>Click the "Verify Email" button in the email</li>
            <li>Return here and log in to access your account</li>
          </ol>
        </div>
        <div className="verification-actions">
          <button
            onClick={handleResendEmail}
            disabled={isResending || !email}
            className="btn btn-outline btn-full"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          {resendMessage && (
            <div className={`verification-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}>
              {resendMessage}
            </div>
          )}
          {!email && (
            <div className="verification-message error">
              Unable to resend verification email: no email address found.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Verify Your Email</h1>
          {renderSubtitle()}
        </div>
        <div className="email-verification-content">
          <div className="verification-icon">📧</div>
          {renderContent()}
        </div>
        <div className="auth-footer">
          <p className="auth-footer-text">
            Already verified? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
          <p className="auth-footer-text">
            Wrong email? <Link to="/register" className="auth-link">Sign up again</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
