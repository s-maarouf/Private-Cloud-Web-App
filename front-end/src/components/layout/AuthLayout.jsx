import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children, pageTitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <Link to="/">
            <img src="/logo.png" alt="OpenStack Cloud Platform" />
          </Link>
        </div>
        
        {pageTitle && <h1 className="auth-page-title">{pageTitle}</h1>}
        
        <main className="auth-main">
          {children}
        </main>
        
        <footer className="auth-footer">
          <p>&copy; {new Date().getFullYear()} OpenStack Plateforme Éducative</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;