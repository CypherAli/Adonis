import React, { createContext, useState, useContext, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };
        
        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onRemove }) => {
    const getIcon = () => {
        switch (toast.type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info':
            default: return 'ℹ️';
        }
    };

    return (
        <div className={`toast toast-${toast.type}`}>
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => onRemove(toast.id)}>
                ✕
            </button>
        </div>
    );
};
