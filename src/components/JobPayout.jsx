// kazispot/frontend/app/src/components/JobPayout.jsx (COMPLETE REPLACEMENT)

import React, { useState } from 'react';
import LiveMap from './LiveMap'; // NEW IMPORT
import '../App.css'; 

const MOCK_JOB_ID = 'KS-J001';
const MOCK_JOB_PAY = 500;
const MOCK_WORKER_PHONE = '0701987654'; 
const MOCK_WORKER_NAME = 'Jane Doe (KaziPro)'; 

const JobPayout = ({ onPayoutComplete, onOpenChat }) => { 
  const [rating, setRating] = useState(5); 
  const [message, setMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false); 

  const handlePayout = async () => {
    setMessage('Initiating Instant M-Pesa Payout...');
    setIsPaying(true);

    try {
      const response = await fetch('http://localhost:3000/api/payments/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobID: MOCK_JOB_ID, employeePhone: MOCK_WORKER_PHONE, finalAmount: MOCK_JOB_PAY }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success! ${data.message} ${MOCK_WORKER_NAME} was paid Ksh ${MOCK_JOB_PAY}.`);
        onPayoutComplete(); 
      } else {
        setMessage(`❌ Error: ${data.message || 'Payout failed. Funds remain in Escrow.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Check backend status.');
      console.error('Fetch error:', error);
    } finally {
        setIsPaying(false);
    }
  };

  const handlePanicAlert = async () => {
      setIsAlerting(true);
      setMessage('Sending Panic Alert to KaziSpot Support...');

      try {
        const response = await fetch('http://localhost:3000/api/safety/panic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobID: MOCK_JOB_ID,
                userRole: 'Employer',
                location: 'Simulated GPS: Westlands/Kilimani border'
            })
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(`🚨 ${data.message}`);
        } else {
            setMessage(`❌ Alert failed: ${data.message}`);
        }
      } catch (error) {
        setMessage('❌ Network Error. Alert failed to send.');
        console.error('Panic fetch error:', error);
      } finally {
        setIsAlerting(false);
      }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text" style={{color: '#005A9C'}}>Job In Action!</h1>
      <p className="header-text">
        Worker: **{MOCK_WORKER_NAME}** | Job ID: **{MOCK_JOB_ID}**
        <br/>
        Amount Due: **Ksh {MOCK_JOB_PAY}** (Held in Escrow)
      </p>

      {/* NEW LIVE MAP COMPONENT */}
      <LiveMap jobID={MOCK_JOB_ID} />

      {/* CHAT AND PANIC BUTTONS CONTAINER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
        <button 
            onClick={onOpenChat}
            style={{
                flex: 1,
                background: 'none',
                border: '1px solid #005A9C',
                borderRadius: '8px',
                color: '#005A9C',
                padding: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                marginRight: '10px'
            }}
        >
          Open Secure Chat
        </button>

        <button 
            onClick={handlePanicAlert}
            style={{
                flex: 1,
                backgroundColor: isAlerting ? '#999' : '#DC3545', 
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '10px',
                fontSize: '14px',
                cursor: 'pointer'
            }}
            disabled={isAlerting}
        >
          {isAlerting ? 'Alert Sent...' : '🚨 Panic Button'}
        </button>
      </div>
      
      {/* Worker Rating */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #EEE', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 'bold' }}>
            Rate your worker (Required for payout):
        </p>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="auth-input"
          style={{ width: 'auto', display: 'inline-block', letterSpacing: 'normal' }}
        >
          <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
          <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
          <option value={3}>⭐⭐⭐ (Average)</option>
          <option value={2}>⭐⭐ (Poor)</option>
          <option value={1}>⭐ (Unacceptable)</option>
        </select>
      </div>

      {/* Payout Button */}
      <button 
        onClick={handlePayout}
        className="submit-button"
        style={{backgroundColor: isPaying ? '#999' : '#28A745'}} 
        disabled={isPaying}
      >
        {isPaying ? 'Paying Instantly...' : `Mark Complete & INSTANT PAYOUT Ksh ${MOCK_JOB_PAY}`}
      </button>
      
      {message && (
        <p className={`message-area ${message.startsWith('❌') || message.startsWith('🚨') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default JobPayout;