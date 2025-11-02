// kazispot/frontend/app/src/components/KaziProFilter.jsx
import React from 'react';

const KaziProFilter = ({ isChecked, onToggle }) => {
  const switchStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '22px',
    marginRight: '10px'
  };

  const sliderStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isChecked ? '#FFD700' : '#ccc',
    transition: '.4s',
    borderRadius: '22px',
    boxShadow: isChecked ? '0 0 5px #FFD700' : 'none'
  };

  const knobStyle = {
    position: 'absolute',
    content: '""',
    height: '18px',
    width: '18px',
    left: '2px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%',
    transform: isChecked ? 'translateX(18px)' : 'translateX(0)'
  };

  return (
    <div 
        style={{
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            border: isChecked ? '1px solid #FFD700' : '1px solid #eee', 
            borderRadius: '8px', 
            backgroundColor: isChecked ? '#FFFBEB' : '#F9F9F9',
            marginBottom: '20px'
        }}
    >
      <div style={switchStyle} onClick={onToggle}>
        <div style={sliderStyle}>
          <div style={knobStyle}></div>
        </div>
      </div>
      <label style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
        Hire KaziPro Elite Only (Ksh 200 Premium Fee)
      </label>
    </div>
  );
};

export default KaziProFilter;