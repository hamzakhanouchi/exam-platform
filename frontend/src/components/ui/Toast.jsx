import React, { useState, createContext, useContext } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, variant = 'success', title = '') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, variant, title }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (variant) => {
        switch (variant) {
            case 'success':
                return <FiCheckCircle />;
            case 'error':
                return <FiAlertCircle />;
            case 'warning':
                return <FiAlertTriangle />;
            default:
                return <FiInfo />;
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container-custom">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-custom ${toast.variant}`}>
                        <span className="toast-icon">{getIcon(toast.variant)}</span>
                        <div className="toast-content">
                            {toast.title && <div className="toast-title">{toast.title}</div>}
                            <div className="toast-message">{toast.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};