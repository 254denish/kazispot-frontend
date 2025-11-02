// kazispot/frontend/app/src/App.jsx

import React, { useState } from 'react';
import SignUp from './components/SignUp';
import OTPValidation from './components/OTPValidation';
import PostJob from './components/PostJob'; 
import JobPayout from './components/JobPayout'; 
import JobChat from './components/JobChat'; 
import JobFeed from './components/JobFeed'; 
import './App.css'; 

const MOCK_PARTNER_NAME = 'Jane Doe'; 

function App() {
  // Possible values: 'SIGNUP', 'OTP', 'ID_VETTING', 'JOB_POSTING', 'PAYOUT', 'CONFIRMATION', 'CHAT', 'JOB_FEED'
  const [phase, setPhase] = useState('SIGNUP'); 
  const [currentPhone, setCurrentPhone] = useState(null);
  const [userRole, setUserRole] = useState(null); 

  // --- Handlers for navigating between screens ---

  const handleRegistrationSuccess = (phoneNumber, role) => {
    setCurrentPhone(phoneNumber);
    setUserRole(role); 
    setPhase('OTP');
  };

  const handleVerificationSuccess = (nextStep) => {
    setPhase('ID_VETTING');
  };

  const handleIDVettingComplete = () => {
      if (userRole === 'Employer') {
          // *** FIX HERE ***
          // Employers now go to post a job instead of skipping to payout
          setPhase('JOB_POSTING'); 
      } else {
          setPhase('JOB_FEED'); // Route Employee to their new Job Feed
      }
  };

  const handleJobPosted = () => {
      // After posting a job, an Employer will typically go to the Job Payout screen
      // (simulating that the job was immediately filled and started)
      setPhase('PAYOUT'); 
  };

  const handlePayoutConfirmation = () => {
      setPhase('CONFIRMATION');
  };

  const handleOpenChat = () => {
      setPhase('CHAT');
  };

  const handleExitChat = () => {
      setPhase('PAYOUT'); 
  };
  
  const handleSignOut = () => {
    // Reset state and go back to the Sign Up screen
    setCurrentPhone(null);
    setUserRole(null);
    setPhase('SIGNUP');
  };


  // --- Render the current phase ---
  let content;

  if (phase === 'SIGNUP') {
    content = <SignUp onRegistrationSuccess={handleRegistrationSuccess} />;
  } else if (phase === 'OTP' && currentPhone) {
    content = (
      <OTPValidation 
        phoneNumber={currentPhone} 
        onVerificationSuccess={handleVerificationSuccess} 
      />
    );
  } else if (phase === 'ID_VETTING') {
    content = (
      <div className="app-container">
        <h1 className="logo-text" style={{color: '#005A9C'}}>Mandatory Vetting</h1>
        <p className="header-text">
          ✅ Phone verified. Next up: **National ID Vetting** (Trust & Safety First).
          <br/><small style={{color: '#999'}}>Your ID has been submitted for Admin review.</small>
        </p>
        <button 
            className="submit-button" 
            style={{backgroundColor: '#28A745'}}
            onClick={handleIDVettingComplete} 
        >
            Simulate ID Approval & Continue
        </button>
      </div>
    );
  } else if (phase === 'JOB_FEED' && userRole === 'Employee') {
      // THE NEW EMPLOYEE JOB FEED SCREEN
      content = <JobFeed employeePhone={currentPhone} onSignOut={handleSignOut} />;

  } else if (phase === 'JOB_POSTING' && userRole === 'Employer') {
      // The Job Posting Screen is now visible for Employers
      content = <PostJob employerPhone={currentPhone} onJobPosted={handleJobPosted} />;

  } else if (phase === 'PAYOUT' && userRole === 'Employer') {
      content = <JobPayout onPayoutComplete={handlePayoutConfirmation} onOpenChat={handleOpenChat} />;

  } else if (phase === 'CHAT' && userRole === 'Employer') {
      content = <JobChat partnerName={MOCK_PARTNER_NAME} onExitChat={handleExitChat} />;

  } else if (phase === 'CONFIRMATION' && userRole === 'Employer') {
      content = (
        <div className="app-container">
            <h1 className="logo-text" style={{color: '#28A745'}}>Payment Finalized!</h1>
            <p className="header-text">
                Thank you for using KaziSpot. Your worker has been paid **instantly** in full.
            </p>
            <button className="submit-button" onClick={handleSignOut}>
                Post Another Job
            </button>
        </div>
      );
  } else {
      content = (
        <div className="app-container">
            <p className="header-text">Error: Something went wrong. Restarting.</p>
            <button className="submit-button" onClick={() => setPhase('SIGNUP')}>
                Start Over
            </button>
        </div>
      );
  }

  return (
    <div className="app-main-view">
      {content}
    </div>
  );
}

export default App;
