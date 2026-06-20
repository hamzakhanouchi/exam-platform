import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Vérifier si le token est expiré
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

// Récupérer l'état initial depuis localStorage
const getInitialState = () => {
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr && !isTokenExpired(token)) {
            const user = JSON.parse(userStr);
            return { token, user, isAuthenticated: true };
        }
    } catch {
        localStorage.clear();
    }
    return { token: null, user: null, isAuthenticated: false };
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialState);
    const navigate = useNavigate();

    // Définir logout avec useCallback pour éviter les re-créations inutiles
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({ token: null, user: null, isAuthenticated: false });
        navigate('/login');
    }, [navigate]);

    // Vérifier l'expiration du token toutes les minutes
    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                logout();
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [logout]); // ← logout ajouté en dépendance

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, id, username: userName, email, role } = response.data;

            const user = { id, username: userName, email, role };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setAuthState({ token, user, isAuthenticated: true });

            // Redirection selon le rôle
            const roleMap = {
                STUDENT: '/student/dashboard',
                PROFESSOR: '/professor/dashboard',
                ADMIN: '/admin/dashboard',
            };
            navigate(roleMap[role] || '/');

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur de connexion';
            return { success: false, message };
        }
    };

    const value = {
        ...authState,
        login,
        logout,
        role: authState.user?.role,
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};