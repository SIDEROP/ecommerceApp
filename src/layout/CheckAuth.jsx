import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { reLoginUser } from '../store/slices/authSlice'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'

const CheckAuth = () => {
    const { isAuthenticated, user,loading } = useSelector((state) => state.auth.reLogin)

    let naviget = useNavigate()
    let dispatch = useDispatch()
    useEffect(() => {
        dispatch(reLoginUser())
    }, [])


    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            return naviget('/ecommerceApp/admin',{ replace: true })
        }
    }, [isAuthenticated])
    return (
        <>
        {
            loading?<Loading/>:null
        }
            <Navbar />
            <div id="scroleDiv">
                <Outlet />
            </div>
        </>
    )
}

export default CheckAuth
