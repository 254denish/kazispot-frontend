// kazispot/frontend/app/src/components/JobPayout.jsx

import React, { useState } from 'react';
import '../App.css';
import { API_BASE_URL } from '../config';

const JobPayout = ({ onPayoutComplete, onOpenChat }) => {
  const [message, setMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const jobID = 'KSJ-001';
  const amount = 1500;
  const workerID = 'EMP-456';

  const handlePayout = async () => {
    setMessage('Initiating Instant Payout via M-Pesa...');
    setIsPaying(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobID, amount, workerID }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setTimeout(() => onPayoutComplete(), 3000);
      } else {
        setMessage(`❌ Error: ${data.message || 'Payout failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Check backend status.');
      console.error('Fetch error:', error);
    } finally {
      setIsPaying(false);
    }
  };

  const handlePanic = async () => {
    setMessage('Sending emergency alert...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/safety/panic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobID,
          userRole: 'Employer',
          location: 'Kilimani, Nairobi',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`🚨 ${data.message}`);
      } else {
        setMessage(`❌ Error sending alert: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Network Error: Could not reach emergency services API.');
      console.error('Panic error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text" style={{ color: '#B8860B' }}>Job Status: In Progress</h1>
      <p className="header-text">
        Worker: <strong>Jane Doe</strong> (KaziPro Elite) is on the job.<br />
        Escrow Funded: <strong>Ksh {amount}</strong>
      </p>

      <div className="action-row">
        <button className="secondary-button" onClick={onOpenChat}>
          💬 Chat with Worker
        </button>
        <button className="secondary-button panic" onClick={handlePanic}>
          🚨 Panic Button
        </button>
      </div>

      <p className="instruction-text">
        When the work is 100% complete, click the button below to release the funds.
      </p>

      <button
        className="submit-button"
        style={{ backgroundColor: isPaying ? '#999' : '#28A745' }}
        onClick={handlePayout}
        disabled={isPaying}
      >
        {isPaying ? 'Processing Instant Payout...' : '✅ Confirm Completion & Instant Payout'}
      </button>

      {message && (
        <p className={`message-area ${message.startsWith('❌') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default JobPayout;
