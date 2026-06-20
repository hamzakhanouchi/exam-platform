import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        // Rediriger vers le dashboard correspondant à son rôle réel
        const roleMap = {
            STUDENT: '/student/dashboard',
            PROFESSOR: '/professor/dashboard',
            ADMIN: '/admin/dashboard',
        };
        return <Navigate to={roleMap[role] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;