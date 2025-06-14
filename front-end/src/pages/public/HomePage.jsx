import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaUser, FaUserPlus, FaLaptop, FaUsers, FaBook, FaFlask } from 'react-icons/fa';

const HomePage = () => {
	return (
		<div className="home-container">
			<div className="home-content">
				<div className="home-header">
					<h1>Bienvenue
					<p className="tagline">sur votre Plateforme d'apprentissage pour la formation en technologie cloud</p></h1>
        </div>
        
        <div className="hero-section">
          <div className="hero-text">
            <h2>Apprenez. Pratiquez. Maîtrisez.</h2>
            <p>
              OpenStack est une plateforme éducative conçue pour permettre aux étudiants 
              d'acquérir des compétences pratiques en technologies cloud, réseaux et systèmes.
						Accédez à des cours structurés, des laboratoires virtuels et des ressources pédagogiques
						créés par des experts du domaine.
						</p>
					</div>
					<div className="hero-image">
						{/* Image placeholder représentant des étudiants travaillant sur la plateforme */}
					</div>
				</div>
        <div className="cta-container">
          <Link to="/login" className="btn btn-login">
            <FaUser className="btn-icon" />
            Connexion
          </Link>
          <Link to="/register" className="btn btn-register">
            <FaUserPlus className="btn-icon" />
            Inscription
          </Link>
        </div>
				<div className="features-section">
					<div className="feature">
						<div className="feature-icon">
							<FaLaptop />
						</div>
						<h3>Laboratoires Virtuels</h3>
						<p>Accédez à des environnements de pratique sécurisés pour mettre en application vos connaissances</p>
					</div>

					<div className="feature">
						<div className="feature-icon">
							<FaBook />
						</div>
						<h3>Cours Structurés</h3>
						<p>Suivez des parcours pédagogiques personnalisés adaptés à votre niveau et à vos objectifs</p>
					</div>

					<div className="feature">
						<div className="feature-icon">
							<FaUsers />
						</div>
						<h3>Enseignement Collaboratif</h3>
						<p>Interagissez avec vos enseignants et camarades de classe dans un environnement d'apprentissage collaboratif</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">
              <FaFlask />
            </div>
            <h3>Projets Pratiques</h3>
            <p>Développez votre portfolio avec des projets guidés qui reflètent des scénarios réels</p>
          </div>
        </div>
        
        <div className="user-stories">
          <h2>Adapté à tous les profils</h2>
          <div className="user-stories-container">
            <div className="user-story">
              <h3>Pour les étudiants</h3>
              <p>Accédez à des cours structurés, des laboratoires pratiques et suivez votre progression dans votre parcours d'apprentissage.</p>
						</div>
						<div className="user-story">
							<h3>Pour les enseignants</h3>
							<p>Créez et gérez des cours, suivez la progression de vos élèves et fournissez un retour personnalisé sur leurs travaux.</p>
						</div>
						<div className="user-story">
							<h3>Pour les administrateurs</h3>
							<p>Supervisez l'ensemble de la plateforme, gérez les classes, les matières et les utilisateurs avec des outils dédiés.</p>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat">
            <h3>15+</h3>
            <p>Matières spécialisées</p>
          </div>
          <div className="stat">
            <h3>100+</h3>
            <p>Laboratoires pratiques</p>
          </div>
          <div className="stat">
            <h3>1000+</h3>
            <p>Étudiants actifs</p>
          </div>
        </div>
        

      </div>
		</div>
	);
};

export default HomePage;
