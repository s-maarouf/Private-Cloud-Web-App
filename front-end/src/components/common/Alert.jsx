import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">{message}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;