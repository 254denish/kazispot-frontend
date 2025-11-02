// kazispot/frontend/app/src/components/SignUp.jsx
import React, { useState } from 'react';
import '../App.css';
import { API_BASE_URL } from '../config'; // NEW IMPORT FROM CENTRAL CONFIG

const SignUp = ({ onRegistrationSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!userRole) {
      setMessage('❌ Please select your role (Employer or Employee) first.');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('❌ Please enter a valid M-Pesa phone number.');
      return;
    }

    setMessage(`Sending verification code to ${phoneNumber}...`);
    setIsSending(true);

    try {
      // API call using the LIVE URL
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, role: userRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        // Delay to show the message before changing phase
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

  return (
    <div className="app-container">
      <h1 className="logo-text">Join KaziSpot!</h1>
      <p className="header-text">
        Please select your role and enter your M-Pesa phone number for instant payouts.
      </p>

      <div className="role-selector">
        <button
          type="button"
          className={`role-button ${userRole === 'Employer' ? 'role-active-employer' : ''}`}
          onClick={() => setUserRole('Employer')}
        >
          I Need Workers (Employer)
        </button>
        <button
          type="button"
          className={`role-button ${userRole === 'Employee' ? 'role-active-employee' : ''}`}
          onClick={() => setUserRole('Employee')}
        >
          I Need Work (Employee)
        </button>
      </div>

      <form onSubmit={handleSendOTP} style={{ width: '100%' }}>
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
          style={{backgroundColor: isSending ? '#999' : '#28A745'}}
          disabled={isSending || !userRole || phoneNumber.length < 9}
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
