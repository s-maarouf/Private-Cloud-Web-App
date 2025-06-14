import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import apiServices from '../../services/api';
import UserForm from './forms/UserForm';

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiServices.admin.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError('Échec du chargement des utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user => {
    return (
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };
  
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action est irréversible.')) {
      try {
        await apiServices.admin.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        setError('Échec de la suppression de l\'utilisateur. Veuillez réessayer.');
      }
    }
  };
  
  const handleFormSubmit = (userData) => {
    if (currentUser) {
      // Mise à jour d'un utilisateur existant
      try {
        apiServices.admin.updateUser(currentUser.id, userData);
        setShowForm(false);
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        setError('Échec de la mise à jour de l\'utilisateur. Veuillez réessayer.');
      }
    } else {
      // Création d'un nouvel utilisateur
      try {
        apiServices.admin.createUser(userData);
        setShowForm(false);
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la création de l\'utilisateur:', err);
        setError('Échec de la création de l\'utilisateur. Veuillez réessayer.');
      }
    }
  };
  
  if (loading) {
    return <div className="loading-container">Chargement des utilisateurs...</div>;
  }
  
  return (
    <div className="users-panel">
      <div className="panel-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="add-btn" onClick={handleAddUser}>
          <FaUserPlus /> Ajouter un utilisateur
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher des utilisateurs..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      {showForm && (
        <UserForm
          user={currentUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td className="actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEditUser(user)}
                    title="Modifier l'utilisateur"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteUser(user.id)}
                    title="Supprimer l'utilisateur"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPanel;