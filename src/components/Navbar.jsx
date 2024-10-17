import React, { useEffect, useState } from 'react';
import './css/Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoSearchSharp } from 'react-icons/io5';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { AiOutlineLogin } from 'react-icons/ai';
import BackBtn from './ui/BackBtn';

const Navbar = () => {
    const { isAuthenticated, user, loading } = useSelector(
        (state) => state.auth.reLogin
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Search state and handling
    const [searchQuery, setSearchQuery] = useState('');
    const { searchResults, loading: searchLoading } = useSelector(
        (state) => state.product.search
    );

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`ecommerceApp/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Scroll behavior for navbar
    useEffect(() => {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.Navbar');
        const scroleDiv = document.getElementById('scroleDiv');

        const handleScroll = () => {
            let scrollTop = scroleDiv.scrollTop;
            if (scrollTop > lastScrollTop) {
                scroleDiv.style.height = 'calc(100% - 0px)';
                navbar.classList.add('show');
            } else {
                navbar.classList.remove('show');
                scroleDiv.style.height = 'calc(100% - 90px)';
            }
            lastScrollTop = scrollTop;
        };

        scroleDiv.addEventListener('scroll', handleScroll);
        return () => {
            scroleDiv.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="Navbar">
            <div style={{justifyContent:"center",display:'flex',alignItems: 'center',gap:10}} className="Logo" onClick={() => navigate('ecommerceApp/')}>
               {
                <div style={{width:"fit-content"}}>
                <BackBtn />
            </div>
               }
                
                TOKO SHOPE {'>'}
            </div>

            <div className="Navbar-inner2">
                <div className="Navbar-inner2Box">
                    <form onSubmit={handleSearch}>
                        <span>
                            <IoSearchSharp color="white" size={20} />
                        </span>{' '}
                        <input
                            type="text"
                            placeholder="Search.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Auth Section */}
                    <i style={{ cursor: 'pointer' }}>
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'user' ? (
                                    <>
                                        <span className="adminTooltip">
                                            LogOut
                                        </span>
                                        <RiLogoutCircleLine
                                            size={22}
                                            onClick={() =>
                                                dispatch(logoutUser()).then(
                                                    () => navigate('ecommerceApp/')
                                                )
                                            }
                                        />
                                    </>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <span className="adminTooltip">Login</span>
                                <AiOutlineLogin
                                    size={22}
                                    onClick={() => navigate('ecommerceApp/auth')}
                                />
                            </>
                        )}
                    </i>
                </div>
            </div>

            {/* Main routes */}
            <div id="MainRouts">
                <span>
                    <span className="tookTip">My Order</span>
                    <NavLink
                        to="ecommerceApp/order"
                        className={({ isActive }) =>
                            isActive ? 'active' : null
                        }
                    >
                        <img
                            style={{ width: '30px' }}
                            src="https://cdn-icons-png.freepik.com/512/12516/12516620.png"
                        />
                    </NavLink>
                </span>
                <span className="">
                    <span className="tookTip">My Cart</span>
                    <NavLink
                        to="ecommerceApp/cart"
                        className={({ isActive }) =>
                            isActive ? 'active' : null
                        }
                    >
                        <img
                            style={{ width: '30px' }}
                            src="https://cdn-icons-png.freepik.com/512/6145/6145556.png"
                        />
                    </NavLink>
                </span>
                <span>
                    <span className="tookTip">My Whislist</span>
                    <NavLink
                        to="ecommerceApp/whislist"
                        className={({ isActive }) =>
                            isActive ? 'active' : null
                        }
                    >
                        <img
                            style={{ width: '30px' }}
                            src="https://static.vecteezy.com/system/resources/previews/026/679/012/non_2x/wish-list-3d-illustration-icon-png.png"
                        />
                    </NavLink>
                </span>
                <span>
                    <span className="tookTip">My Account</span>
                    <NavLink
                        to="ecommerceApp/account"
                        className={({ isActive }) =>
                            isActive ? 'active' : null
                        }
                    >
                        <img
                            style={{ width: '30px' }}
                            src="https://static.vecteezy.com/system/resources/thumbnails/010/175/289/small/3d-rendering-of-cute-icon-illustration-profile-approved-png.png"
                        />
                    </NavLink>
                </span>
            </div>

            {/* You can also display search results in the navbar or in a separate search page */}
            {searchLoading && <p>Loading search results...</p>}
        </div>
    );
};

export default Navbar;
