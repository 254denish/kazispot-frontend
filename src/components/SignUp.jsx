// kazispot/frontend/app/src/components/SignUp.jsx
import React, { useState } from 'react';
import '../App.css'; 
import { API_BASE_URL } from '../config';

const SignUp = ({ onRegistrationSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userRole, setUserRole] = useState(null); // 'Employer' or 'Employee'
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Sending OTP...');
    setIsSending(true);

    try {
      // Retries the fetch request with exponential backoff
      const maxRetries = 3;
      let response;
      for (let i = 0; i < maxRetries; i++) {
          try {
              response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ phoneNumber, role: userRole }),
              });
              if (response.ok || response.status < 500) {
                  // Success or non-server error (like 400s), break retry loop
                  break;
              }
          } catch (fetchError) {
              if (i === maxRetries - 1) throw fetchError; // Rethrow on last attempt
              const delay = Math.pow(2, i) * 1000; // Exponential backoff (1s, 2s, 4s)
              await new Promise(resolve => setTimeout(resolve, delay));
          }
      }

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        // Simulate a slight delay before moving to the next screen
        setTimeout(() => {
            onRegistrationSuccess(phoneNumber, userRole); 
        }, 1500);
        
      } else {
        setMessage(`❌ Error: ${data.message || 'Registration failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Cannot connect to KaziSpot API.');
      console.error('Fetch error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isFormValid = userRole && phoneNumber.length >= 7; // Minimum length check

  return (
    <div className="app-container">
      <h1 className="logo-text">Join KaziSpot</h1>
      <p className="header-text">
        Please select your role and enter your M-Pesa phone number for instant payouts.
      </p>

      {/* --- Role Selection Buttons --- */}
      <div className="role-selection-container">
        <button
          type="button"
          className={`role-button ${userRole === 'Employer' ? 'selected' : ''}`}
          onClick={() => setUserRole('Employer')}
        >
          I Need Workers <br />
          <small>(Employer)</small>
        </button>
        <button
          type="button"
          className={`role-button ${userRole === 'Employee' ? 'selected' : ''}`}
          onClick={() => setUserRole('Employee')}
        >
          I Need Work <br />
          <small>(Employee)</small>
        </button>
      </div>

      <form onSubmit={handleRegister} style={{ width: '100%' }}>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter M-Pesa Phone Number (e.g., 07XXXXXXX)"
          className="auth-input"
          required
        />
        <button
          type="submit"
          className="submit-button"
          // Set color based on state, overriding the general submit-button style for disabled state
          style={{backgroundColor: isSending || !isFormValid ? '#999' : '#28A745'}}
          disabled={isSending || !isFormValid}
        >
          {isSending ? 'Sending...' : 'Send Verification Code (OTP)'}
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

export default SignUp;
