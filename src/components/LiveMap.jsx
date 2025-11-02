// kazispot/frontend/app/src/components/LiveMap.jsx
import React, { useState, useEffect } from 'react';

const LiveMap = ({ jobID }) => {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLocation = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/safety/location/${jobID}`);
            const data = await response.json();
            setLocation(data);
        } catch (error) {
            console.error("Error fetching live location:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch once immediately
        fetchLocation();

        // Set up a refresh interval to simulate "Live" data update every 5 seconds
        const intervalId = setInterval(fetchLocation, 5000); 

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [jobID]);


    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '10px'}}>Loading Live Location...</div>;
    }

    if (!location) {
        return <div style={{textAlign: 'center', padding: '10px', color: '#DC3545'}}>Location unavailable.</div>;
    }
    
    // Simulate a map view with data
    return (
        <div style={{ 
            border: '2px solid #005A9C', 
            borderRadius: '10px', 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#E6F0F6'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#005A9C', borderBottom: '1px solid #005A9C', paddingBottom: '5px' }}>
                📍 Live Worker Location (Trust & Safety)
            </h4>
            <div style={{ height: '100px', backgroundColor: '#DDD', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
                [Simulated Map View of Nairobi]
            </div>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                Worker: {location.workerName}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#28A745' }}>
                Status: **{location.status}**
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                Last Update: {location.timestamp} | Coords: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
        </div>
    );
};

export default LiveMap;