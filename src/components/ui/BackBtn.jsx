import React from 'react';
import './css/BackBtn.css';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BackBtn = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        const historyState = window.history.state;
        if (historyState && historyState.idx > 0) {
            navigate(-1);
        } else {
            navigate('ecommerceApp/', { replace: true });
        }
    };

    return (
        <span className="back-icons" onClick={handleBackClick}>
            <IoChevronBack size={24} />
        </span>
    );
};

export default BackBtn;
