// kazispot/frontend/app/src/components/JobPayout.jsx
import React, { useState } from 'react';
import '../App.css';
import { API_BASE_URL } from '../config'; // NEW IMPORT FROM CENTRAL CONFIG

const JobPayout = ({ onPayoutComplete, onOpenChat }) => {
  const [message, setMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handlePayout = async () => {
    setMessage('Initiating Instant Payout via M-Pesa...');
    setIsPaying(true);

    try {
      // API call using the LIVE URL
      const response = await fetch(`${API_BASE_URL}/api/payments/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            jobID: 'KSJ-001', 
            amount: 1500, // Example job amount
            workerID: 'EMP-456'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        // Delay to show the message before changing phase
        setTimeout(() => {
          onPayoutComplete();
        }, 3000);
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
  
  const handlePanic = async (userRole) => {
      setMessage('Sending emergency alert...');
      try {
          // API call using the LIVE URL
          const response = await fetch(`${API_BASE_URL}/api/safety/panic`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  jobID: 'KSJ-001', 
                  userRole: userRole, 
                  location: 'Kilimani, Nairobi' 
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
      }
  };


  return (
    <div className="app-container">
      <h1 className="logo-text" style={{color: '#B8860B'}}>Job Status: In Progress</h1>
      <p className="header-text">
        Worker: **Jane Doe** (KaziPro Elite) is on the job. <br/>
        Escrow Funded: **Ksh 1500**
      </p>

      <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '20px' }}>
        <button 
          className="secondary-button"
          style={{flexGrow: 1, backgroundColor: '#E9E9E9', color: '#333'}}
          onClick={onOpenChat}
        >
          💬 Chat with Worker
        </button>
        <button 
          className="secondary-button"
          style={{flexGrow: 1, backgroundColor: '#FFCCCC', color: '#D9534F'}}
          onClick={() => handlePanic('Employer')}
        >
          🚨 Panic Button
        </button>
      </div>

      <p style={{ margin: '15px 0 10px 0', fontSize: '14px', color: '#666' }}>
        When the work is 100% complete, click the button below to release the funds.
      </p>

      <button 
        className="submit-button"
        style={{backgroundColor: isPaying ? '#999' : '#28A745'}}
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
