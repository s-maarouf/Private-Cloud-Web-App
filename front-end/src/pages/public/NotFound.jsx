import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Non Trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="home-button">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default NotFound;
