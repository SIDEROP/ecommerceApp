import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { reLoginUser } from '../store/slices/authSlice';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout = () => {
    const { isAuthenticated, user, loading } = useSelector(
        (state) => state.auth.reLogin
    );
    let naviget = useNavigate();
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(reLoginUser());
    }, []);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            return naviget('/ecommerceApp/admin', { replace: true });
        } else if (isAuthenticated && user?.role === 'user') {
            return naviget('/ecommerceApp/', { replace: true });
        } else {
            return naviget('/ecommerceApp/adminLogin', { replace: true });
        }
    }, [isAuthenticated]);

    return (
        <>
            <div className="Admin">
                <Sidebar />
                <Outlet />
            </div>
        </>
    );
};

export default AdminLayout;
