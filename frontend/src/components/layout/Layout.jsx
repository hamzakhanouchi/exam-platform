import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../styles/global.css';

const Layout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="layout">
            <Sidebar collapsed={sidebarCollapsed} />
            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <main className="content">{children}</main>
            </div>
        </div>
    );
};

export default Layout;