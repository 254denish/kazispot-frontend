// kazispot/frontend/app/src/components/PostJob.jsx (COMPLETE REPLACEMENT)

import React, { useState } from 'react';
import KaziProFilter from './KaziProFilter';
import BoostToggle from './BoostToggle'; // NEW IMPORT
import '../App.css';

const KAZIPRO_FEE = 200;
const BOOST_FEE = 100; // NEW FEE

const PostJob = ({ employerPhone, onJobPosted }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [isKaziProFiltered, setIsKaziProFiltered] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false); // NEW STATE

  const jobAmount = parseFloat(payAmount) || 0;
  const kaziProFee = isKaziProFiltered ? KAZIPRO_FEE : 0;
  const boostFee = isBoosted ? BOOST_FEE : 0; // CALCULATE BOOST FEE
  
  // FINAL TOTAL CALCULATION
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
      const response = await fetch('http://localhost:3000/api/payments/fund-escrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            amount: totalEscrowAmount, 
            employerPhone: employerPhone, 
            jobTitle: jobTitle,
            isKaziProFiltered: isKaziProFiltered,
            isBoosted: isBoosted // SEND BOOST STATUS
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message} Simulating successful payment...`);
        // Simulate a 3-second delay for the STK Push process
        setTimeout(() => {
            onJobPosted();
        }, 3000);
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
      <h1 className="logo-text" style={{color: '#005A9C'}}>Post a Job (Simplicity First)</h1>
      <p className="header-text">
        Employer Phone: **{employerPhone}**. <br/>
        Your funds secure the job in our **M-Pesa Escrow.**
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
        
        {/* KAZIPRO FILTER */}
        <KaziProFilter 
            isChecked={isKaziProFiltered}
            onToggle={() => setIsKaziProFiltered(!isKaziProFiltered)}
        />
        
        {/* NEW BOOST TOGGLE */}
        <BoostToggle 
            isChecked={isBoosted}
            onToggle={() => setIsBoosted(!isBoosted)}
            boostFee={BOOST_FEE}
        />

        
        <div style={{ padding: '15px', border: '1px solid #005A9C', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#E6F0F6' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px', color: '#005A9C' }}>
                Total Employer Cost:
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                Job Pay (100% to Worker): **Ksh {jobAmount.toFixed(0)}**
            </p>
            {isKaziProFiltered && (
                 <p style={{ margin: '0', fontSize: '14px', color: '#B8860B' }}>
                    KaziPro Service Fee: **Ksh {kaziProFee.toFixed(0)}**
                </p>
            )}
            {isBoosted && (
                 <p style={{ margin: '0', fontSize: '14px', color: '#28A745' }}>
                    Post Boost Fee: **Ksh {boostFee.toFixed(0)}**
                </p>
            )}
            <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', fontSize: '18px', borderTop: '1px dashed #005A9C', paddingTop: '5px' }}>
                TOTAL ESCROW: **Ksh {totalEscrowAmount.toFixed(0)}**
            </p>
        </div>


        <button 
          type="submit"
          className="submit-button"
          style={{backgroundColor: isFunding ? '#999' : '#005A9C'}}
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