import React, { useState } from 'react';
import axios from 'axios';
import './OTPValidation.css';

function OTPValidation({ phoneNumber, onVerificationSuccess, onBack, onRestart }) {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        phone: phoneNumber,
        code: otp,
      });

      if (response.data.success) {
        setStatus('OTP verified successfully!');
        onVerificationSuccess();
      } else {
        setStatus(response.data.message || 'Verification failed.');
      }
    } catch (err) {
      setStatus('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-validation-container">
      <h2>Enter OTP</h2>
      <p>We sent a code to <strong>{phoneNumber}</strong></p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        maxLength={6}
      />

      <button
        className="verify"
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      {status && (
        <p className={status.includes('successfully') ? 'status-message' : 'error-message'}>
          {status}
        </p>
      )}

      <div className="otp-actions">
        <button className="secondary" onClick={onBack}>Back</button>
        <button className="secondary" onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}

export default OTPValidation;
