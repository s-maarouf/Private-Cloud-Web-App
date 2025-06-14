import React from 'react';

const Button = ({ children, className = '', disabled = false, type = 'button', onClick }) => {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;