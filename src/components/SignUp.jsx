// kazispot/frontend/app/src/components/SignUp.jsx (COMPLETE REPLACEMENT)

import React, { useState } from 'react';
import '../App.css'; 

// The component now accepts 'onRegistrationSuccess' to pass back data
const SignUp = ({ onRegistrationSuccess }) => { 
  const [userType, setUserType] = useState('Employee'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Sending verification code...');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- CRITICAL CHANGE: Pass phone number AND userType back to the App component ---
        onRegistrationSuccess(phoneNumber, userType); 
        // ----------------------------------------------------------------------------------
      } else {
        setMessage(`❌ Error: ${data.message || 'Failed to connect to KaziSpot server.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Ensure the backend server is running on port 3000.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text">KaziSpot</h1>
      
      <p className="header-text">
        Please select your role and enter your M-Pesa phone number for instant payouts.
      </p>

      {/* Role Selector */}
      <div className="role-selector">
        <button 
          onClick={() => setUserType('Employer')}
          className={`role-button ${userType === 'Employer' ? 'selected' : ''}`}
        >
          I Need Workers
        </button>
        <button 
          onClick={() => setUserType('Employee')}
          className={`role-button ${userType === 'Employee' ? 'selected' : ''}`}
        >
          I Need Work
        </button>
      </div>

      {/* Phone Verification Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="tel"
          className="auth-input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter M-Pesa Phone Number (e.g., 07XXXXXXXX)"
          required
        />
        <button type="submit" className="submit-button">
          Send Verification Code (OTP)
        </button>
      </form>
      
      {/* Message Area */}
      {message && (
        <p className={`message-area ${message.startsWith('❌') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SignUp;