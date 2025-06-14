import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${className}`}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;