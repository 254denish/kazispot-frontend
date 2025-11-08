import React, { useState } from 'react';
import '../App.css';
import { API_BASE_URL } from '../config';

const SignUp = ({ onRegistrationSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isFormValid = userRole && phoneNumber.length >= 7;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Sending OTP...');
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/id-verification/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setTimeout(() => onRegistrationSuccess(phoneNumber, userRole), 1500);
      } else {
        setMessage(`❌ Error: ${data.error || 'OTP sending failed.'}`);
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
      <h1 className="logo-text">Join KaziSpot</h1>
      <p className="header-text">
        Select your role and enter your M-Pesa number for instant payouts.
      </p>

      <div className="role-selection-container">
        {['Employer', 'Employee'].map((role) => (
          <button
            key={role}
            type="button"
            className={`role-button ${userRole === role ? 'selected' : ''}`}
            onClick={() => setUserRole(role)}
            style={{ marginBottom: '10px' }}
          >
            <strong>{role === 'Employer' ? 'I Need Workers' : 'I Need Work'}</strong>
            <br />
            <small>({role})</small>
          </button>
        ))}
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
          style={{ backgroundColor: isSending || !isFormValid ? '#999' : '#28A745' }}
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
