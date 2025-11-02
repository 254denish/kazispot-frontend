// kazispot/frontend/app/src/components/KaziProBadge.jsx
import React from 'react';

const KaziProBadge = () => {
    return (
        <div style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: '#FFD700', // Gold color for elite status
            color: '#333',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            marginRight: '10px'
        }}>
            ✨ KaziPro Exclusive
        </div>
    );
};

export default KaziProBadge;