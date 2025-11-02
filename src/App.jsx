// kazispot/frontend/app/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import SignUp from './components/SignUp';
import OTPValidation from './components/OTPValidation';
import IDVetting from './components/IDVetting';
import JobFeed from './components/JobFeed';
import JobPayout from './components/JobPayout';
import PostJob from './components/PostJob';

// --- MAIN APP COMPONENT ---
function App() {
  // Application State
  const [currentScreen, setCurrentScreen] = useState('SIGN_UP');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'Employer' or 'Employee'
  const [isVetted, setIsVetted] = useState(false);
  const [isKaziPro, setIsKaziPro] = useState(false); // Used for Job Feed filtering

  // Use localStorage to persist minimal state (userId and role) across sessions
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedVetted = localStorage.getItem('isVetted') === 'true';

    if (savedRole) {
      setUserRole(savedRole);
      setIsVetted(savedVetted);

      // Determine the initial screen based on saved state
      if (savedVetted) {
        if (savedRole === 'Employee') {
          setCurrentScreen('JOB_FEED');
        } else if (savedRole === 'Employer') {
          // *** CRITICAL FIX HERE ***
          // Employers who are already vetted should go straight to Job Posting
          setCurrentScreen('JOB_POSTING'); 
        }
      } else {
        // If role is saved but not vetted, go to vetting screen
        setCurrentScreen('ID_VETTING');
      }
    }
  }, []);

  // --- Handlers for Screen Transitions ---

  const handleRegistrationSuccess = (phone, role) => {
    setPhoneNumber(phone);
    setUserRole(role);
    localStorage.setItem('userRole', role);
    setCurrentScreen('OTP_VALIDATION');
  };

  const handleOTPValidationSuccess = () => {
    setCurrentScreen('ID_VETTING');
  };
  
  const handleVettingSuccess = (kaziProStatus) => {
    setIsVetted(true);
    setIsKaziPro(kaziProStatus); // Save the KaziPro status
    localStorage.setItem('isVetted', 'true');

    if (userRole === 'Employee') {
      setCurrentScreen('JOB_FEED');
    } else if (userRole === 'Employer') {
      // Employer flow now goes to the Job Posting screen!
      setCurrentScreen('JOB_POSTING'); 
    }
  };

  const handlePostJobSuccess = () => {
    // After an Employer successfully posts a job, they go to the Payout screen
    // This simulates the job being completed and payment being required
    setCurrentScreen('PAYOUT');
  };

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isVetted');
    localStorage.removeItem('phoneNumber');
    setPhoneNumber(null);
    setUserRole(null);
    setIsVetted(false);
    setIsKaziPro(false);
    // When an employer clicks "Post Another Job" on the payout screen, 
    // we want them to go back to JOB_POSTING, not SIGN_UP
    if (currentScreen === 'PAYOUT' && userRole === 'Employer') {
      setCurrentScreen('JOB_POSTING');
    } else {
      setCurrentScreen('SIGN_UP');
    }
  };


  // --- Router Logic ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'SIGN_UP':
        return <SignUp onRegistrationSuccess={handleRegistrationSuccess} />;

      case 'OTP_VALIDATION':
        return <OTPValidation phoneNumber={phoneNumber} onVerificationSuccess={handleOTPValidationSuccess} />;
      
      case 'ID_VETTING':
        return <IDVetting userRole={userRole} onVettingSuccess={handleVettingSuccess} />;

      case 'JOB_FEED':
        return <JobFeed isKaziPro={isKaziPro} onSignOut={handleSignOut} />;

      case 'JOB_POSTING':
        return <PostJob onPostJobSuccess={handlePostJobSuccess} onSignOut={handleSignOut} />;

      case 'PAYOUT':
        return <JobPayout onPostAnotherJob={handleSignOut} onSignOut={handleSignOut} />; // Reuse handleSignOut to navigate back to job posting
        
      default:
        return <SignUp onRegistrationSuccess={handleRegistrationSuccess} />;
    }
  };

  // --- Main Render ---
  return (
    <div className="app-main-view">
      {renderScreen()}
    </div>
  );
}

export default App;
