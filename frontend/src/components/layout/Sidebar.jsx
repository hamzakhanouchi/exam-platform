import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome,
    FiBookOpen,
    FiBarChart2,
    FiUsers,
    FiPlusCircle,
    FiActivity,
    FiLogOut,
} from 'react-icons/fi';

const Sidebar = ({ collapsed }) => {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = {
        STUDENT: [
            { to: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
            { to: '/student/exams', icon: FiBookOpen, label: 'Examens' },
            { to: '/student/results', icon: FiBarChart2, label: 'Résultats' },
        ],
        PROFESSOR: [
            { to: '/professor/dashboard', icon: FiHome, label: 'Dashboard' },
            { to: '/professor/exams/create', icon: FiPlusCircle, label: 'Nouvel examen' },
        ],
        ADMIN: [
            { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
            { to: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
            { to: '/admin/logs', icon: FiActivity, label: 'Sécurité' },
        ],
    };

    const items = menuItems[role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-brand">
                <span className="logo-icon">📘</span>
                {!collapsed && <span className="brand-text">AcademicTestHub</span>}
            </div>
            <nav className="sidebar-nav">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="icon" />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
                <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto' }}>
                    <FiLogOut className="icon" />
                    {!collapsed && <span>Déconnexion</span>}
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;