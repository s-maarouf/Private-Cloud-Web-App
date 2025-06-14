import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout';
import './Dashboard.css';

// Teacher panels
import ClassesPanel from './panels/ClassesPanel';
import LabsPanel from './panels/LabsPanel';
import ProfilePanel from './panels/ProfilePanel';
import NewLabForm from './forms/NewLabForm';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    classes: 0,
    subjects: 0,
    labs: 0,
    students: 0
  });

  useEffect(() => {
    // Fetch teacher data and statistics
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // Get teacher ID from localStorage or context
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        
        // Fetch teacher profile if we have a user ID
        if (userData.id) {
          try {
            const response = await fetch(`/api/user/${userData.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.ok) {
              const teacherData = await response.json();
              setTeacher(teacherData);
            } else {
              throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Fallback to local storage data
            setTeacher(userData);
          }
          
          // Fetch statistics - using the available endpoints
          try {
            // Get all classes and filter by teacher
            const classesResponse = await fetch('/api/class', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            let teacherClasses = [];
            if (classesResponse.ok) {
              const classesData = await classesResponse.json();
              // Filter classes that this teacher is associated with
              // Note: The API doesn't provide a direct endpoint for teacher's classes,
              // so we need to filter on the client side based on teacher_id
              teacherClasses = classesData.filter(c => 
                c.teacher_id === userData.id || 
                (c.teachers && c.teachers.some(t => t.id === userData.id))
              );
            }
            
            // Get all subjects
            const subjectsResponse = await fetch('/api/subject', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            let teacherSubjects = [];
            if (subjectsResponse.ok) {
              const subjectsData = await subjectsResponse.json();
              // Filter subjects for this teacher
              teacherSubjects = subjectsData.filter(s => 
                s.teacher_id === userData.id
              );
            }
            
            // Get students count (we'll get all classes and count unique students)
            // Since we don't have a dedicated endpoint for student counts per teacher,
            // we'll count estimated students from the teacher's classes
            const studentCount = teacherClasses.reduce((total, c) => {
              // Add estimated student count (or use actual if available)
              return total + (c.student_count || 0);
            }, 0);
            
            // Calculate lab count
            // Again, we don't have a direct endpoint for teacher's labs
            // We'll estimate from the classes
            const labCount = teacherClasses.reduce((total, c) => {
              // Add lab count (or use 0 if not available)
              return total + (c.labs?.length || 0);
            }, 0);
            
            // Set the collected statistics
            setStats({
              classes: teacherClasses.length,
              subjects: teacherSubjects.length,
              labs: labCount,
              students: studentCount
            });
            
          } catch (statsError) {
            console.error('Error fetching statistics:', statsError);
            // Fallback to placeholder stats
            setStats({
              classes: 0,
              subjects: 0,
              labs: 0,
              students: 0
            });
          }
        }
      } catch (err) {
        setError("Impossible de charger les données de l'enseignant");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'classes':
        return <ClassesPanel teacherId={teacher?.id} />;
      case 'labs':
        return <LabsPanel teacherId={teacher?.id} />;
      case 'profile':
        return <ProfilePanel teacher={teacher} />;
      case 'newLab':
        return <NewLabForm teacherId={teacher?.id} />;
      case 'overview':
      default:
        return (
          <div className="overview-panel">
            <h2>Tableau de bord enseignant</h2>
            
            {loading ? (
              <div className="openstack-loading">Chargement des données...</div>
            ) : error ? (
              <div className="openstack-error">{error}</div>
            ) : (
              <>
                <div className="stat-cards">
                  <div className="stat-card">
                    <h3>Mes Classes</h3>
                    <p className="stat-number">{stats.classes}</p>
                    <button onClick={() => setActiveTab('classes')} className="view-more-btn">
                      Voir plus
                    </button>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Mes Laboratoires</h3>
                    <p className="stat-number">{stats.labs}</p>
                    <button onClick={() => setActiveTab('labs')} className="view-more-btn">
                      Voir plus
                    </button>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Mes Étudiants</h3>
                    <p className="stat-number">{stats.students}</p>
                    <button onClick={() => setActiveTab('profile')} className="view-more-btn">
                      Voir plus
                    </button>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={() => setActiveTab('newLab')} 
                    className="create-lab-btn"
                  >
                    <i className="lab-icon">🧪</i> Créer un nouveau laboratoire
                  </button>
                </div>
                
                <div className="recent-activity">
                  <h3>Activité récente</h3>
                  <div className="activity-card">
                    <p>Pas d'activité récente à afficher.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="openstack-authenticated-layout">
      <Sidebar role="teacher" />
      
      <div className="openstack-authenticated-content">
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </button>
          <button 
            className={`tab-button ${activeTab === 'classes' ? 'active' : ''}`} 
            onClick={() => setActiveTab('classes')}
          >
            Mes Classes
          </button>
          <button 
            className={`tab-button ${activeTab === 'labs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('labs')}
          >
            Laboratoires
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profile')}
          >
            Mon Profil
          </button>
          <button 
            className={`tab-button ${activeTab === 'newLab' ? 'active' : ''}`} 
            onClick={() => setActiveTab('newLab')}
          >
            Nouveau Laboratoire
          </button>
        </div>
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
