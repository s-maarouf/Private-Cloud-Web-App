import React from 'react';
import MenAvatar from '../../components/images/MenAvatar.jpg';
import BTSlogo from '../../components/images/bts.jpg';
import './Sidebar.css';

const Sidebar = ({ activePanel, setActivePanel, userData }) => {
	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userRole');
		window.location.href = '/login';
	};

	return (
		<div className="student-sidebar">
			<div className="sidebar-header">
				<div className="logo">
					<img src={BTSlogo} alt="Logo" />
					<span>BTS AlFarabi</span>
				</div>

				<div className="user-info">
					<div className="avatar">
						<img src={MenAvatar} alt="Avatar" />
					</div>
					<div className="user-details">
						<h3>{userData?.first_name} {userData?.name}</h3>
						<div className="user-role">Étudiant</div>
					</div>
				</div>
			</div>

			<nav className="sidebar-nav">
				<ul>
					<li 
						className={activePanel === 'profile' ? 'active' : ''} 
						onClick={() => setActivePanel('profile')}
					>
						<i className="fas fa-user"></i>
						<span>Profil</span>
					</li>
					<li 
						className={activePanel === 'subjects' ? 'active' : ''} 
						onClick={() => setActivePanel('subjects')}
					>
						<i className="fas fa-book"></i>
						<span>Matières</span>
					</li>
					<li 
						className={activePanel === 'labs' ? 'active' : ''} 
						onClick={() => setActivePanel('labs')}
					>
						<i className="fas fa-flask"></i>
						<span>Laboratoires</span>
					</li>
					<li 
						className={activePanel === 'progress' ? 'active' : ''} 
						onClick={() => setActivePanel('progress')}
					>
						<i className="fas fa-chart-line"></i>
						<span>Progression</span>
					</li>
				</ul>
			</nav>

			<div className="sidebar-footer">
				<button className="logout-btn" onClick={handleLogout}>
					<i className="fas fa-sign-out-alt"></i>
					<span>Déconnexion</span>
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
