// kazispot/frontend/app/src/components/OTPValidation.jsx
import React, { useState } from 'react'; // CORRECTED SYNTAX: using 'from'
import '../App.css';
import { API_BASE_URL } from '../config'; 

const OTPValidation = ({ phoneNumber, onVerificationSuccess }) => {
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otpCode !== '1234') {
        setMessage('Simulating server validation. Use code 1234.');
    }

    setMessage('Verifying code...');
    setIsVerifying(true);

    try {
      // API call using the LIVE URL
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setTimeout(() => {
            onVerificationSuccess(data.nextStep);
        }, 1500);
      } else {
        setMessage(`❌ Error: ${data.message || 'OTP verification failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Cannot connect to KaziSpot API.');
      console.error('Fetch error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text" style={{color: '#005A9C'}}>Verify Phone</h1>
      <p className="header-text">
        Code sent to **{phoneNumber}**. Enter the code below. (Use **1234** in this demo)
      </p>

      <form onSubmit={handleVerifyOTP} style={{ width: '100%' }}>
        <input
          type="tel"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Enter 4-digit code (e.g., 1234)"
          className="auth-input"
          maxLength="4"
          required
        />
        <button
          type="submit"
          className="submit-button"
          style={{backgroundColor: isVerifying ? '#999' : '#005A9C'}}
          disabled={isVerifying || otpCode.length !== 4}
        >
          {isVerifying ? 'Verifying...' : 'Validate Code'}
        </button>
      </form>

      {message && (
        <p className={`message-area ${message.startsWith('❌') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default OTPValidation;
