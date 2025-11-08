// kazispot/frontend/app/src/components/JobFeed.jsx

import React, { useState, useEffect } from 'react';
import KaziProBadge from './KaziProBadge';
import '../App.css';
import { API_BASE_URL } from '../config';

const MOCK_ACTIVE_JOB_ID = 'KSJ-005';

const JobFeed = ({ employeePhone, onSignOut }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAlerting, setIsAlerting] = useState(false);

  const fetchJobs = async () => {
    setMessage('Fetching available jobs near you in Nairobi...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/feed`);
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

    if (job?.isKaziProExclusive) {
      setMessage('❌ Application Blocked: This is a KaziPro Exclusive job. Requires 4.8+ rating and verified ID.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeePhone }),
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

  const handlePanicAlert = async () => {
    if (!MOCK_ACTIVE_JOB_ID) {
      setMessage('⚠️ Cannot send panic alert: You are not currently active on a job.');
      return;
    }

    setIsAlerting(true);
    setMessage('Sending Panic Alert to KaziSpot Support...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/safety/panic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobID: MOCK_ACTIVE_JOB_ID,
          userRole: 'Employee',
          location: 'Simulated GPS: Kilimani Event Venue',
        }),
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
      <div className="header-row">
        <h1 className="logo-text">KaziSpot Feed</h1>
        <button onClick={onSignOut} className="signout-button">Sign Out</button>
      </div>

      <p className="header-text">Location: <strong>Nairobi CBD (Live)</strong>. Available jobs near you:</p>

      <button
        onClick={handlePanicAlert}
        className="panic-button"
        disabled={isAlerting}
      >
        {isAlerting ? 'Alert Sent - Support Contacting You...' : '🚨 Immediate Safety Alert (Panic Button)'}
      </button>

      <div className="kazi-pro-callout">
        <p>See the high-paying jobs? <strong>Earn the KaziPro Badge</strong> to unlock them!</p>
      </div>

      {message && (
        <p className={`message-area ${message.startsWith('❌') || message.startsWith('🚨') ? 'message-error' : 'message-success'}`}>
          {message}
        </p>
      )}

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="job-list">
          {jobs.length === 0 ? (
            <p className="no-jobs">No jobs available right now. Check back soon!</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className={`job-card ${job.isKaziProExclusive ? 'kazi-pro' : ''}`}
              >
                <div className="job-header">
                  <div>
                    {job.isKaziProExclusive && <KaziProBadge />}
                    <h3 className="job-title">{job.title}</h3>
                  </div>
                  <div className="job-pay">Ksh {job.pay}</div>
                </div>
                <p className="job-meta">📍 {job.location} | ⏱️ {job.time}</p>
                <p className="job-details">{job.details}</p>
                <button
                  className="submit-button"
                  onClick={() => handleApply(job.id, job.title)}
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
