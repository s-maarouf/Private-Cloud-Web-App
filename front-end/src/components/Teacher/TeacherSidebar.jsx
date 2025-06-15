import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChalkboardTeacher, FaHome, FaPowerOff } from 'react-icons/fa';
import teacherAvatar from '../../components/images/MenAvatar.jpg';
import BTSlogo from '../../components/images/bts.jpg';


const TeacherSidebar = ({ activePanel, setActivePanel, teacherData }) => {
	// Handle API response format - data may be in user object
	const userData = teacherData?.user || teacherData || {};

	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear authentication data
		localStorage.removeItem('token');
		localStorage.removeItem('userRole');
		// Navigate to login
		navigate('/login');
	};

	return (
		<div className="teacher-sidebar">
			<div className="sidebar-header">
				<div className="logo">
					<img src={BTSlogo} alt="BTS Logo" />
					<span>BTS AlFarabi</span>
				</div>
				<div className="user-info">
					<div className="avatar">
						<img 
							src={teacherAvatar} 
							alt="Teacher Avatar"
							onError={(e) => {
								e.target.onerror = null;
								e.target.style.display = 'none';
								e.target.parentNode.innerHTML = '<div class="avatar-fallback"><FaUser size={24} /></div>';
							}}
						/>
					</div>
					<div className="user-details">
						<h3>{userData?.first_name} {userData?.name}</h3>
						<span className="user-role">Enseignant</span>
					</div>
				</div>
			</div>

			<nav className="sidebar-nav">
				<ul>
					<li>
						<button
							className={activePanel === 'overview' ? 'active' : ''}
							onClick={() => setActivePanel('overview')}
						>
							<FaHome className="icon" />
							<span>Tableau de bord</span>
						</button>
					</li>
					<li>
						<button
							className={activePanel === 'classes' ? 'active' : ''}
							onClick={() => setActivePanel('classes')}
						>
							<FaChalkboardTeacher className="icon" />
							<span>Mes Classes</span>
						</button>
					</li>
					<li>
						<button
							className={activePanel === 'profile' ? 'active' : ''}
							onClick={() => setActivePanel('profile')}
						>
							<FaUser className="icon" />
							<span>Profil Enseignant</span>
						</button>
					</li>
				</ul>
			</nav>

			<div className="sidebar-footer">
				<button onClick={handleLogout} className="logout-btn">
					<FaPowerOff className="icon" />
					<span>Se déconnecter</span>
				</button>
			</div>
		</div>
	);
};

export default TeacherSidebar;
