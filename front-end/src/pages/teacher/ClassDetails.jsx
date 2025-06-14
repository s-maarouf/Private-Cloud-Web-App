import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaFlask, FaUserGraduate, FaClipboardCheck } from 'react-icons/fa';
import apiServices from '../../services/api';

const ClassDetails = ({ classData, onBack, onCreateLab }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [labs, setLabs] = useState([]);
	const [students, setStudents] = useState([]);
	const [activeTab, setActiveTab] = useState('labs');

	useEffect(() => {
		const fetchClassDetails = async () => {
			try {
				setLoading(true);
				setError(null);

				// Récupérer les laboratoires associés à cette classe
				const labsResponse = await apiServices.teacher.getClassLabs(classData.id);
				setLabs(labsResponse.labs || labsResponse || []);

				// Récupérer les étudiants de cette classe
				const studentsResponse = await apiServices.teacher.getClassStudents(classData.id);
				setStudents(studentsResponse.students || studentsResponse || []);

			} catch (err) {
				console.error('Erreur lors du chargement des détails de la classe:', err);
				setError('Impossible de charger les détails de la classe. Veuillez réessayer.');
			} finally {
				setLoading(false);
			}
		};

		fetchClassDetails();
	}, [classData.id]);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const getProgressColor = (progress) => {
		if (progress < 30) return "#e74c3c";
		if (progress < 70) return "#f39c12";
		return "#2ecc71";
	};

	const getLabStatusClass = (status) => {
		switch (status) {
			case 'approved':
				return 'status-approved';
			case 'pending':
				return 'status-pending';
			case 'rejected':
				return 'status-rejected';
			default:
				return '';
		}
	};

	const getLabStatusLabel = (status) => {
		switch (status) {
			case 'approved':
				return 'Approuvé';
			case 'pending':
				return 'En Attente';
			case 'rejected':
				return 'Rejeté';
			default:
				return 'Inconnu';
		}
	};

	if (loading) {
		return (
			<div className="openstack-loading">
				<div className="spinner"></div>
				<p>Chargement des détails de la classe...</p>
			</div>
		);
	}

	return (
		<div className="openstack-class-details">
			<div className="openstack-class-details-header">
				<button className="openstack-back-btn" onClick={onBack}>
					<FaArrowLeft /> Retour aux Classes
				</button>
				<h2>{classData.name}</h2>
				<button className="openstack-create-lab-btn" onClick={onCreateLab}>
					<FaFlask /> Créer un Laboratoire
				</button>
			</div>

			{error && <div className="openstack-error">{error}</div>}

			<div className="openstack-class-info">
				<div className="openstack-info-card">
					<div className="openstack-info-icon students">
						<FaUserGraduate />
					</div>
					<div className="openstack-info-content">
						<h3>Étudiants</h3>
						<p className="openstack-info-value">{students.length}</p>
					</div>
				</div>

				<div className="openstack-info-card">
					<div className="openstack-info-icon labs">
						<FaFlask />
					</div>
					<div className="openstack-info-content">
						<h3>Laboratoires</h3>
						<p className="openstack-info-value">{labs.length}</p>
					</div>
				</div>

				<div className="openstack-info-card">
					<div className="openstack-info-icon completion">
						<FaClipboardCheck />
					</div>
					<div className="openstack-info-content">
						<h3>Avancement Moyen</h3>
						<p className="openstack-info-value">
							{labs.length > 0 
								? Math.round(labs.reduce((sum, lab) => sum + (lab.completion || 0), 0) / labs.length) + '%'
								: 'N/A'}
						</p>
					</div>
				</div>
			</div>

			<div className="openstack-class-tabs">
				<button 
					className={`tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
					onClick={() => handleTabChange('labs')}
				>
					<FaFlask /> Laboratoires
				</button>
				<button 
					className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
					onClick={() => handleTabChange('students')}
				>
					<FaUserGraduate /> Étudiants
				</button>
			</div>

			<div className="openstack-tab-content">
				{activeTab === 'labs' && (
					<>
						{labs.length > 0 ? (
							<div className="openstack-labs-table">
								<table>
									<thead>
										<tr>
											<th>Titre</th>
											<th>Matière</th>
											<th>Statut</th>
											<th>Niveau de Réalisation</th>
											<th>Date de Création</th>
										</tr>
									</thead>
									<tbody>
										{labs.map(lab => (
											<tr key={lab.id}>
												<td>{lab.title}</td>
												<td>{lab.subject?.name || 'Non spécifié'}</td>
												<td>
													<span className={`openstack-status ${getLabStatusClass(lab.status)}`}>
														{getLabStatusLabel(lab.status)}
													</span>
												</td>
												<td>
													<div className="openstack-progress-container">
														<div 
															className="openstack-progress-bar" 
															style={{ 
																width: `${lab.completion || 0}%`,
																backgroundColor: getProgressColor(lab.completion || 0)
															}}
														></div>
														<span className="openstack-progress-text">{lab.completion || 0}%</span>
													</div>
												</td>
												<td>{new Date(lab.created_at).toLocaleDateString('fr-FR')}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="openstack-no-data">
								<FaFlask size={40} />
								<p>Aucun laboratoire n'est associé à cette classe.</p>
                <button className="openstack-create-lab-btn" onClick={onCreateLab}>
                  Créer un nouveau laboratoire
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'students' && (
          <>
            {students.length > 0 ? (
              <div className="openstack-students-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.last_name}</td>
                        <td>{student.first_name}</td>
                        <td>{student.email}</td>
                        <td>
                          <div className="openstack-progress-container">
                            <div 
                              className="openstack-progress-bar" 
                              style={{ 
                                width: `${student.progress || 0}%`,
                                backgroundColor: getProgressColor(student.progress || 0)
                              }}
                            ></div>
                            <span className="openstack-progress-text">{student.progress || 0}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="openstack-no-data">
                <FaUserGraduate size={40} />
                <p>Aucun étudiant n'est inscrit dans cette classe.</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ClassDetails;
