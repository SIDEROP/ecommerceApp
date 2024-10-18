import React from 'react';
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
// shopping pages
import Home from './page/shopping/Home';
import Order from './page/shopping/Order';
import Cart from './page/shopping/Cart';
import Whislist from './page/shopping/Whislist';
import Account from './page/shopping/Account';
import Mobile from './page/shopping/Mobile';
import ProductInfo from './page/shopping/ProductInfo';

// admin pages
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
                <Route path="/ecommerceApp" element={<CheckAuth />}>
                    {/* main normal route for shopping */}
                    <Route path="/ecommerceApp" element={<Home />} />
                    <Route path="/ecommerceApp/mobile" element={<Mobile />} />
                    {/* user account shop routes */}
                    <Route path="/ecommerceApp/order" element={<Order />} />
                    <Route path="/ecommerceApp/cart" element={<Cart />} />
                    <Route path="/ecommerceApp/whislist" element={<Whislist />} />
                    <Route path="/ecommerceApp/account" element={<Account />} />
                    <Route
                        path="/ecommerceApp/product/:productId"
                        element={<ProductInfo />}
                    />
                    <Route path="/ecommerceApp/search" element={<SearchProduct />} />

                    <Route path="/ecommerceApp/success/:orderId?" element={<Success />} />
                    <Route path="/ecommerceApp/cancel" element={<Cancel />} />
                </Route>

                <Route path="/ecommerceApp/auth" element={<AuthLayout />}>
                    <Route path="" element={<Login />} />
                    <Route path="register" element={<SingUp />} />
                </Route>

                <Route path="/ecommerceApp" element={<AdminLayout />}>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="adminorder" element={<OrderAdmin />} />
                    <Route path="product" element={<ProductAdmin />} />
                    <Route path="adminAccount" element={<AdminAccount />} />
                </Route>

                <Route path="/ecommerceApp/adminLogin" element={<AdminAuth />}>
                    <Route path="" element={<LoginAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
