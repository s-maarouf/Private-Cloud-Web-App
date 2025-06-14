import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import { Sidebar } from './components/layout';

// Pages
import HomePage from './pages/public/HomePage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AdminDashboard from './components/Admin/AdminDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import NotFound from './pages/public/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);

	// Check authentication status on initial load
	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedRole = localStorage.getItem('userRole');

		if (token) {
			setIsAuthenticated(true);
			setUserRole(storedRole);
		}
	}, []);

	// Create a layout for authenticated users
	const AuthenticatedLayout = ({ children }) => {
		return (
			<div className="openstack-authenticated-layout">
				<Sidebar role={userRole} />
				<div className="openstack-authenticated-content">
					{children}
				</div>
			</div>
		);
	};

	return (
		<Router>
			<div className="openstack-app">
				<main className="openstack-main-content">
					<Routes>
						{/* Public Routes */}
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
						<Route path="/register" element={<Register />} />

						{/* Admin Routes */}
						<Route 
							path="/admin/dashboard" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['administrator']}
									redirectPath="/login"
									userRole={userRole}
								>
									<AuthenticatedLayout>
										<AdminDashboard />
									</AuthenticatedLayout>
								</ProtectedRoute>
							} 
						/>

						{/* Teacher Routes */}
						<Route 
							path="/teacher/dashboard" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['teacher', 'enseignant']}
									redirectPath="/login"
									userRole={userRole}
								>
									<TeacherDashboard />
								</ProtectedRoute>
							} 
						/>
						
						{/* Additional teacher routes - Handled by panel switching inside TeacherDashboard */}
						<Route 
							path="/teacher/classes" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['teacher', 'enseignant']}
									redirectPath="/login"
									userRole={userRole}
								>
									<TeacherDashboard />
								</ProtectedRoute>
							} 
						/>
						
						<Route 
							path="/teacher/labs" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['teacher', 'enseignant']}
									redirectPath="/login"
									userRole={userRole}
								>
									<TeacherDashboard />
								</ProtectedRoute>
							} 
						/>

						<Route 
							path="/teacher/profile" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['teacher', 'enseignant']}
									redirectPath="/login"
									userRole={userRole}
								>
									<TeacherDashboard />
								</ProtectedRoute>
							} 
						/>

						<Route 
							path="/teacher/labs" 
							element={
								<ProtectedRoute 
									isAuthenticated={isAuthenticated}
									allowedRoles={['teacher', 'enseignant']}
									redirectPath="/login"
									userRole={userRole}
								>
									<TeacherDashboard />
								</ProtectedRoute>
							}
						/>

						{/* 404 Page */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
