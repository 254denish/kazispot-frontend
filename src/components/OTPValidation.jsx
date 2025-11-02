// kazispot/frontend/app/src/components/OTPValidation.jsx (COMPLETE CODE)

import React, { useState } from 'react';
import '../App.css'; 

const OTPValidation = ({ phoneNumber, onVerificationSuccess, onResendClick }) => {
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('Verifying code...');

    if (otpCode.length !== 4) {
      setMessage('❌ Code must be 4 digits.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success! ${data.message}`);
        // Call the success handler passed from the parent App component
        onVerificationSuccess(data.nextStep); 
      } else {
        setMessage(`❌ Error: ${data.message || 'Verification failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Please check your connection.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text">KaziSpot</h1>
      
      <p className="header-text" style={{marginBottom: '10px'}}>
        Enter the 4-digit code sent to: **{phoneNumber}**
      </p>

      <form onSubmit={handleVerify} className="auth-form" style={{marginTop: '20px'}}>
        <input
          type="number"
          className="auth-input"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.slice(0, 4))} // Limit to 4 digits
          placeholder="XXXX"
          required
          style={{fontSize: '24px', letterSpacing: '20px'}}
        />
        <button type="submit" className="submit-button">
          Verify Phone Number
        </button>
      </form>

      <button 
        onClick={onResendClick} 
        style={{marginTop: '15px', background: 'none', border: 'none', color: '#005A9C', cursor: 'pointer', fontSize: '14px'}}
      >
        Didn't receive code? Resend
      </button>
      
      {message && (
        <p className={`message-area ${message.startsWith('❌') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default OTPValidation;