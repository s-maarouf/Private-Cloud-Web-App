import React, { useState, useEffect } from 'react';
import { FaUsers, FaSchool, FaBook, FaFlask, FaClock } from 'react-icons/fa';
import apiServices from '../../services/api';

const Overview = () => {
  const [stats, setStats] = useState({
    users: { total: 0, students: 0, teachers: 0 },
    classes: 0,
    subjects: 0,
    labs: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Nous pourrions créer un endpoint dédié aux statistiques ou appeler plusieurs endpoints
        // Pour l'instant, nous allons simuler avec des appels individuels
        const [users, classes, subjects, labs] = await Promise.all([
          apiServices.admin.getUsers(),
          apiServices.admin.getClasses(),
          apiServices.admin.getSubjects(),
          apiServices.admin.getLabs()
        ]);

        // Traiter les données pour obtenir les statistiques
        const studentCount = users.users.filter(user => user.role === 'student').length;
        const teacherCount = users.users.filter(user => user.role === 'teacher').length;

        const pendingLabs = labs.labs.filter(lab => lab.status === 'pending').length;
        const approvedLabs = labs.labs.filter(lab => lab.status === 'approved').length;
        const rejectedLabs = labs.labs.filter(lab => lab.status === 'rejected').length;

        setStats({
          users: {
            total: users.users.length,
            students: studentCount,
            teachers: teacherCount
          },
          classes: classes.classes.length,
          subjects: subjects.subjects.length,
          labs: {
            total: labs.labs.length,
            pending: pendingLabs,
            approved: approvedLabs,
            rejected: rejectedLabs
          }
        });

      } catch (err) {
        console.error('Erreur lors de la récupération des données de vue d\'ensemble:', err);
        setError('Échec du chargement des données du tableau de bord. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container">Chargement des données du tableau de bord...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="overview-panel">
      <h1>Tableau de Bord</h1>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>Utilisateurs</h3>
            <div className="stat-count">{stats.users.total}</div>
            <div className="stat-breakdown">
              <span>{stats.users.students} Étudiants</span>
              <span>{stats.users.teachers} Enseignants</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon classes">
            <FaSchool />
          </div>
          <div className="stat-details">
            <h3>Classes</h3>
            <div className="stat-count">{stats.classes}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon subjects">
            <FaBook />
          </div>
          <div className="stat-details">
            <h3>Matières</h3>
            <div className="stat-count">{stats.subjects}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon labs">
            <FaFlask />
          </div>
          <div className="stat-details">
            <h3>Laboratoires</h3>
            <div className="stat-count">{stats.labs.total}</div>
            <div className="stat-breakdown">
              <span className="pending">{stats.labs.pending} En attente</span>
              <span className="approved">{stats.labs.approved} Approuvés</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pending-approvals">
        <h2><FaClock /> Approbations en attente</h2>
        {stats.labs.pending > 0 ? (
          <div className="action-required">
            <p>{stats.labs.pending} laboratoires nécessitent votre approbation</p>
            <button onClick={() => window.location.href = '/admin/labs'} className="action-btn">
              Examiner les laboratoires
            </button>
          </div>
        ) : (
          <p>Aucune approbation en attente pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Overview;