// kazispot/frontend/app/src/components/PostJob.jsx

import React, { useState } from 'react';
import KaziProFilter from './KaziProFilter';
import BoostToggle from './BoostToggle';
import '../App.css';
import { API_BASE_URL } from '../config';

const KAZIPRO_FEE = 200;
const BOOST_FEE = 100;

const PostJob = ({ employerPhone, onJobPosted }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [isKaziProFiltered, setIsKaziProFiltered] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  const jobAmount = parseFloat(payAmount) || 0;
  const kaziProFee = isKaziProFiltered ? KAZIPRO_FEE : 0;
  const boostFee = isBoosted ? BOOST_FEE : 0;
  const totalEscrowAmount = jobAmount + kaziProFee + boostFee;

  const handlePostJob = async (e) => {
    e.preventDefault();

    if (jobAmount < 100) {
      setMessage('❌ Please enter a job amount of at least Ksh 100.');
      return;
    }

    setMessage(`Initiating Escrow Fund via M-Pesa STK Push for Ksh ${totalEscrowAmount}...`);
    setIsFunding(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/fund-escrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalEscrowAmount,
          employerPhone,
          jobTitle,
          isKaziProFiltered,
          isBoosted,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message} Simulating successful payment...`);
        setTimeout(() => onJobPosted(), 3000);
      } else {
        setMessage(`❌ Error: ${data.message || 'Escrow funding failed.'}`);
      }
    } catch (error) {
      setMessage('❌ Network Error. Check backend status.');
      console.error('Fetch error:', error);
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text" style={{ color: '#005A9C' }}>Post a Job (Simplicity First)</h1>
      <p className="header-text">
        Employer Phone: <strong>{employerPhone}</strong><br />
        Your funds secure the job in our <strong>M-Pesa Escrow</strong>.
      </p>

      <form onSubmit={handlePostJob} style={{ width: '100%' }}>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title (e.g., Wash Car, Fix Sink, Garden Tidy)"
          className="auth-input"
          required
        />
        <input
          type="number"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          placeholder="Pay Amount (Ksh, e.g., 1500)"
          className="auth-input"
          min="100"
          required
        />

        <KaziProFilter
          isChecked={isKaziProFiltered}
          onToggle={() => setIsKaziProFiltered(!isKaziProFiltered)}
        />

        <BoostToggle
          isChecked={isBoosted}
          onToggle={() => setIsBoosted(!isBoosted)}
          boostFee={BOOST_FEE}
        />

        <div className="cost-summary">
          <p><strong>Total Employer Cost:</strong></p>
          <p>Job Pay (100% to Worker): <strong>Ksh {jobAmount.toFixed(0)}</strong></p>
          {isKaziProFiltered && (
            <p style={{ color: '#B8860B' }}>KaziPro Service Fee: <strong>Ksh {kaziProFee.toFixed(0)}</strong></p>
          )}
          {isBoosted && (
            <p style={{ color: '#28A745' }}>Post Boost Fee: <strong>Ksh {boostFee.toFixed(0)}</strong></p>
          )}
          <p className="total-escrow">TOTAL ESCROW: <strong>Ksh {totalEscrowAmount.toFixed(0)}</strong></p>
        </div>

        <button
          type="submit"
          className="submit-button"
          style={{ backgroundColor: isFunding ? '#999' : '#005A9C' }}
          disabled={isFunding || !jobTitle || jobAmount < 100}
        >
          {isFunding ? 'Sending STK Push...' : `Post Job & Fund Escrow (Ksh ${totalEscrowAmount.toFixed(0)})`}
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

export default PostJob;
