import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu } from 'react-icons/fi';

const TopBar = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    return (
        <div className="topbar">
            <button className="toggle-btn" onClick={onToggleSidebar}>
                <FiMenu size={22} />
            </button>
            <div className="user-info">
                <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                <span className="username">{user?.username}</span>
            </div>
        </div>
    );
};

export default TopBar;