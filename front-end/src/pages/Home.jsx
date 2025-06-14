import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="card">
        <h1>Bienvenue</h1>
        <p>Connectez-vous pour accéder à votre tableau de bord.</p>
        <a href="/login" className="btn-login">
          Se connecter
        </a>
        <p className="secondary">Vous n'avez pas de compte ? Créez-le maintenant</p>
        <a href="/register" className="btn-register">
          Créer votre compte
        </a>
      </div>
    </div>
  );
};

export default Home;