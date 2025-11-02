// kazispot/frontend/app/src/components/JobFeed.jsx (COMPLETE REPLACEMENT)

import React, { useState, useEffect } from 'react';
import KaziProBadge from './KaziProBadge';
import '../App.css'; 

// Mock Job ID for the employee's current active task
const MOCK_ACTIVE_JOB_ID = 'KSJ-005';

const JobFeed = ({ employeePhone, onSignOut }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAlerting, setIsAlerting] = useState(false); // NEW STATE

  const fetchJobs = async () => {
    setMessage('Fetching available jobs near you in Nairobi...');
    // ... (rest of fetchJobs function is unchanged)
    try {
      const response = await fetch('http://localhost:3000/api/jobs/feed');
      const data = await response.json();
      setJobs(data);
      setMessage(`Found ${data.length} jobs available!`);
    } catch (error) {
      setMessage('❌ Error fetching jobs. Check backend connection.');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId, jobTitle) => {
    setMessage(`Applying for "${jobTitle}"...`);
    const job = jobs.find(j => j.id === jobId);
    
    if (job.isKaziProExclusive) {
        setMessage(`❌ Application Blocked: This is a KaziPro Exclusive job. Requires 4.8+ rating and verified ID.`);
        return; 
    }

    try {
      const response = await fetch(`http://localhost:3000/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeePhone: employeePhone }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Applied! ${data.message}`);
        setJobs(jobs.filter(j => j.id !== jobId));
      } else {
        setMessage(`❌ Application failed: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Network Error during application.');
      console.error('Application error:', error);
    }
  };

  // NEW HANDLER FOR PANIC BUTTON
  const handlePanicAlert = async () => {
    if (!MOCK_ACTIVE_JOB_ID) {
        setMessage('⚠️ Cannot send panic alert: You are not currently active on a job.');
        return;
    }
    
    setIsAlerting(true);
    setMessage('Sending Panic Alert to KaziSpot Support...');

    try {
      const response = await fetch('http://localhost:3000/api/safety/panic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              jobID: MOCK_ACTIVE_JOB_ID,
              userRole: 'Employee',
              location: 'Simulated GPS: Kilimani Event Venue'
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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px'}}>
        <h1 className="logo-text" style={{margin: 0}}>KaziSpot Feed</h1>
        <button 
            onClick={onSignOut} 
            style={{background: 'none', border: 'none', color: '#005A9C', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'}}
        >
            Sign Out
        </button>
      </div>
      
      <p className="header-text" style={{fontSize: '14px', color: '#555'}}>
        Location: **Nairobi CBD (Live)**. Available jobs near you:
      </p>

      {/* Panic Button for Employees */}
      <button 
          onClick={handlePanicAlert}
          style={{
              width: '100%',
              backgroundColor: isAlerting ? '#999' : '#DC3545',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '10px 0',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px'
          }}
          disabled={isAlerting}
      >
          {isAlerting ? 'Alert Sent - Support Contacting You...' : '🚨 Immediate Safety Alert (Panic Button)'}
      </button>
      
      {/* KaziPro Header Callout */}
      <div style={{ 
          padding: '10px', 
          backgroundColor: '#FFFAF0', 
          border: '1px solid #FFD700', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
      }}>
          <p style={{margin: '0', fontSize: '14px', color: '#666'}}>
              See the high-paying jobs? **Earn the KaziPro Badge** to unlock them!
          </p>
      </div>

      {message && (
        <p className={`message-area ${message.startsWith('❌') || message.startsWith('🚨') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <div style={{ width: '100%' }}>
          {jobs.length === 0 ? (
            <p style={{ marginTop: '20px', color: '#999' }}>No jobs available right now. Check back soon!</p>
          ) : (
            jobs.map((job) => (
              <div 
                key={job.id} 
                style={{ 
                  backgroundColor: '#FFF', 
                  padding: '15px', 
                  borderRadius: '10px', 
                  marginBottom: '15px', 
                  boxShadow: job.isKaziProExclusive ? '0 4px 8px rgba(255,215,0,0.4)' : '0 2px 4px rgba(0,0,0,0.1)', 
                  border: job.isKaziProExclusive ? '2px solid #FFD700' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {job.isKaziProExclusive && <KaziProBadge />}
                        <h3 style={{ margin: '5px 0 5px 0', color: '#005A9C' }}>{job.title}</h3>
                    </div>
                    
                    <div style={{ fontWeight: 'bold', color: job.isKaziProExclusive ? '#B8860B' : '#28A745', fontSize: '18px' }}>
                        Ksh {job.pay}
                    </div>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>
                  📍 {job.location} | ⏱️ {job.time}
                </p>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                  {job.details}
                </p>
                
                <button 
                  className="submit-button"
                  onClick={() => handleApply(job.id, job.title)}
                  style={{ 
                    width: '100%', 
                    backgroundColor: job.isKaziProExclusive ? '#999' : '#005A9C', 
                    padding: '10px 0'
                  }}
                  disabled={job.isKaziProExclusive} 
                >
                  {job.isKaziProExclusive ? 'Requires KaziPro Badge' : 'Accept Task (Apply Now)'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobFeed;