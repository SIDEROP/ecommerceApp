import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="cancel-page">
            <div className="cancel-glass">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <Link to="/ecommerceApp">Go to Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
