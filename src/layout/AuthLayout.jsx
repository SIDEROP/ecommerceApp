import React, { useEffect } from 'react';
import './css/AuthLayout.css';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { reLoginUser } from '../store/slices/authSlice';
import Loading from '../components/Loading';

const AuthLayout = () => {
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
        }
    }, [isAuthenticated]);

    return (
        <>
            {loading ? <Loading /> : null}
            <div className="userAuth1">
                <Outlet />
            </div>
        </>
    );
};

export default AuthLayout;
