import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 1000); 

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;
    return (
        <div className={`notification-box ${type === 'success' ? 'success' : 'error'}`}>
            <p>{message}</p>
            <button className="close-button" onClick={onClose}>&times;</button>
        </div>
    );
};

export default Notification;
