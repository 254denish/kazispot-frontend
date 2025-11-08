import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import SignUp from './components/SignUp';
import OTPValidation from './components/OTPValidation';
import IDVetting from './components/IDVetting';
import JobFeed from './components/JobFeed';
import JobPayout from './components/JobPayout';
import PostJob from './components/PostJob';

function App() {
  const [currentScreen, setCurrentScreen] = useState('SIGN_UP');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isVetted, setIsVetted] = useState(false);
  const [isKaziPro, setIsKaziPro] = useState(false);

  // Load persisted state from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedVetted = localStorage.getItem('isVetted') === 'true';

    if (savedRole && savedVetted) {
      setUserRole(savedRole);
      setIsVetted(true);
      setCurrentScreen(savedRole === 'Employee' ? 'JOB_FEED' : 'JOB_POSTING');
    }
  }, []);

  // --- Screen Transition Handlers ---
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
    setIsKaziPro(kaziProStatus);
    localStorage.setItem('isVetted', 'true');
    setCurrentScreen(userRole === 'Employee' ? 'JOB_FEED' : 'JOB_POSTING');
  };

  const handlePostJobSuccess = () => {
    setCurrentScreen('PAYOUT');
  };

  const handleSignOut = () => {
    localStorage.clear();
    setPhoneNumber(null);
    setUserRole(null);
    setIsVetted(false);
    setIsKaziPro(false);
    setCurrentScreen('SIGN_UP');
  };

  // --- Back Button Logic ---
  const handleBack = () => {
    const backMap = {
      OTP_VALIDATION: 'SIGN_UP',
      ID_VETTING: 'OTP_VALIDATION',
      JOB_FEED: 'ID_VETTING',
      JOB_POSTING: 'ID_VETTING',
      PAYOUT: userRole === 'Employer' ? 'JOB_POSTING' : 'JOB_FEED',
    };
    setCurrentScreen(backMap[currentScreen] || 'SIGN_UP');
  };

  // --- Screen Renderer ---
  const renderScreen = () => {
    const commonProps = {
      onBack: handleBack,
      onRestart: handleSignOut,
    };

    const screenMap = {
      SIGN_UP: <SignUp onRegistrationSuccess={handleRegistrationSuccess} />,
      OTP_VALIDATION: <OTPValidation phoneNumber={phoneNumber} onVerificationSuccess={handleOTPValidationSuccess} {...commonProps} />,
      ID_VETTING: <IDVetting userRole={userRole} onVettingSuccess={handleVettingSuccess} {...commonProps} />,
      JOB_FEED: <JobFeed isKaziPro={isKaziPro} onSignOut={handleSignOut} />,
      JOB_POSTING: <PostJob onPostJobSuccess={handlePostJobSuccess} onSignOut={handleSignOut} />,
      PAYOUT: <JobPayout onPostAnotherJob={handleSignOut} onSignOut={handleSignOut} />,
    };

    return screenMap[currentScreen] || screenMap.SIGN_UP;
  };

  return (
    <div className="app-main-view">
      {renderScreen()}
    </div>
  );
}
 
export default App;
