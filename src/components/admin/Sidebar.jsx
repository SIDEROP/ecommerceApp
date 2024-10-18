import React, { useState } from 'react';
import './css/Sidebar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { CiLogout, CiSettings } from 'react-icons/ci';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { logoutUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {

    const {user} = useSelector((state)=>state.auth?.reLogin)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(true);
    return (
        <div className={`AdminSidebar ${toggle ? 'active' : null}`}>
            <span
                className="adminCloseAndOpen"
                onClick={() => setToggle((pre) => !pre)}
            >
                <i>{toggle ? <IoMdArrowDropright /> : <IoMdArrowDropleft />}</i>
            </span>
            <div className="profuleAdmin" onClick={()=>navigate('/ecommerceApp/adminAccount')}>
                <div className="imgAdmin">
                    <img style={{width:"100%"}} src={user?.img} alt="" />
                </div>
                <div className="nameAdmin">
                    <span style={{textTransform:"uppercase"}} className="name">{user?.username}</span>
                    <span style={{fontSize:"7px",textTransform:"uppercase"}} className="type">{user?.role}</span>
                </div>
            </div>
            <div className="listAdminRouts">
                <NavLink
                    to="/ecommerceApp/admin"
                    className={({ isActive }) => (isActive ? 'active' : null)}
                >
                    <i>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/5432/5432747.png"
                            style={{ height: '25px' }}
                            alt=""
                        />
                    </i>
                    <span className="listName">Deshbord</span>
                </NavLink>
                <NavLink
                    to="/ecommerceApp/adminorder"
                    className={({ isActive }) => (isActive ? 'active' : null)}
                >
                    <i>
                        <img
                            src="https://cdn-icons-png.freepik.com/512/6632/6632848.png"
                            style={{ height: '25px' }}
                            alt=""
                        />
                    </i>
                    <span className="listName">Order</span>
                </NavLink>
                <NavLink
                    to="/ecommerceApp/product"
                    className={({ isActive }) => (isActive ? 'active' : null)}
                >
                    <i>
                        <img
                            src="https://cdn3d.iconscout.com/3d/premium/thumb/product-solution-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--gear-inside-box-setting-design-development-pack-business-illustrations-4496040.png"
                            style={{ height: '25px' }}
                            alt=""
                        />
                    </i>
                    <span className="listName">Product</span>
                </NavLink>
            </div>
            <div className="setinAdin" onClick={() => dispatch(logoutUser()).then(()=>navigate("/ecommerceApp/adminLogin"))}>
                <i >
                    <CiLogout />
                </i>
                <i className="logOut">LogOut</i>
            </div>
        </div>
    );
};

export default Sidebar;
