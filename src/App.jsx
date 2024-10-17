import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// layout
import CheckAuth from './layout/CheckAuth';
import AuthLayout from './layout/AuthLayout';
import AdminLayout from './layout/AdminLayout';
import AdminAuth from './layout/AdminAuth';

// pages
import Login from './page/auth/Login';
import Success from './page/Success';
import Cancel from './page/Cancel';
import SingUp from './page/auth/SingUp';
import NotFound from './page/NotFound';
// shopin page
import Home from './page/shopping/Home';
import Order from './page/shopping/Order';
import Cart from './page/shopping/Cart';
import Whislist from './page/shopping/Whislist';
import Account from './page/shopping/Account';
import Mobile from './page/shopping/Mobile';
import ProductInfo from './page/shopping/ProductInfo';

// admin page
import LoginAdmin from './page/admin/LoginAdmin';
import AdminDashboard from './page/admin/AdminDashboard';
import OrderAdmin from './page/admin/OrderAdmin';
import ProductAdmin from './page/admin/ProductAdmin';
import AdminAccount from './page/admin/AdminAccount';
import SearchProduct from './page/shopping/SearchProduct';

const App = () => {
    return (
        <div id="rootMain">
            <Toaster />
            <Routes>
                <Route path="/" element={<CheckAuth />}>
                    {/* main noram route to shoping */}
                    <Route path="/" element={<Home />} />
                    <Route path="/mobile" element={<Mobile />} />
                    {/* user accout shopw routes */}
                    <Route path="/order" element={<Order />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/Whislist" element={<Whislist />} />
                    <Route path="/account" element={<Account />} />
                    <Route
                        path="/product/:productId"
                        element={<ProductInfo />}
                    />
                    <Route path="/search" element={<SearchProduct />} />

                    <Route path="/success/:orderId" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                </Route>

                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="" element={<Login />} />
                    <Route path="register" element={<SingUp />} />
                </Route>

                <Route path="/" element={<AdminLayout />}>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="adminorder" element={<OrderAdmin />} />
                    <Route path="product" element={<ProductAdmin />} />
                    <Route path="adminAccount" element={<AdminAccount />} />
                </Route>

                <Route path="/adminLogin" element={<AdminAuth />}>
                    <Route path="" element={<LoginAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
