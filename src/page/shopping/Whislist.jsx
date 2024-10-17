import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../css/Whislist.css'; // Ensure the CSS contains styles for the morphism glass effect
import {
    fetchWishlist,
    removeFromWishlist,
} from '../../store/slices/wishlistSlice';
import Loader from '../../components/ui/loder';

const Whislist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector(
        (state) => state.auth.reLogin
    );
    const { wishlist, loading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'user') {
            navigate('/auth', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'user') {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated, user]);

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    if (loading) return <Loader />;

    return (
        <div className="wishlist-container">
            {wishlist?.length === 0 ? (
                <p className="empty-message">Your wishlist is empty</p>
            ) : (
                <div className={`wishlist-box`}>
                    <ul className={`wishlist-items ${wishlist?.length > 4?null:"flex"}`}>
                        {wishlist?.map((item) => (
                            <li
                                key={item?.product?._id}
                                className="wishlist-item"
                                onClick={(e) => {
                                    navigate(`/product/${item?.product?._id}`);
                                }}
                            >
                                <div className="wishlist-item-content">
                                    {/* Display Product Image */}
                                    <img
                                        src={item?.product?.images?.[0]}
                                        className="wishlist-item-image"
                                    />

                                    <div className="wishlist-item-details">
                                        <h2>
                                            {item?.product?.name?.split(' ')
                                                .length > 5
                                                ? `${item?.product?.name.split(' ').slice(0, 5).join(' ')}...`
                                                : item?.product?.name}
                                        </h2>
                                        {/* Display Market Price */}
                                        {item?.product?.marketPrice && (
                                            <p
                                                className="market-price"
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'rgba(255, 0, 0, 0.544)',
                                                }}
                                            >
                                                ₹
                                                {item?.product?.marketPrice?.toFixed(
                                                    2
                                                )}
                                            </p>
                                        )}

                                        {/* Display Product Price */}
                                        <p>
                                            ₹{item?.product?.price?.toFixed(2)}
                                        </p>

                                        {/* Conditionally Render Colors and Flavors if they exist */}
                                        {item?.product?.colors?.length > 0 && (
                                            <div className="product-colors">
                                                <strong>
                                                    Available Colors:
                                                </strong>
                                                <ul className="color-list">
                                                    {item?.product?.colors.map(
                                                        (color, index) => (
                                                            <li
                                                                key={index}
                                                                className="color-item"
                                                                style={{
                                                                    backgroundColor:
                                                                        color,
                                                                }}
                                                            ></li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {item?.product?.flavors?.length > 0 && (
                                            <div className="product-flavors">
                                                <strong>Flavors:</strong>
                                                <ul className="flavor-list">
                                                    {item?.product?.flavors.map(
                                                        (flavor, index) => (
                                                            <li key={index}>
                                                                {flavor}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(
                                                    item?.product?._id
                                                );
                                            }}
                                            className="remove-btn"
                                        >
                                            Remove from Wishlist
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Whislist;
