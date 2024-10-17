import React from 'react';
import './css/Card.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProductToCart, getCart } from '../store/slices/cartSlice';

const Card = ({ data }) => {
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth.reLogin
    );
    const {
        addCart: { loading },
    } = useSelector((state) => state.cart);
    let navigate = useNavigate();
    const dispatch = useDispatch();

    // Format price in INR
    const formatPriceInINR = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="card" onClick={() => navigate(`/product/${data?._id}`)}>
            <div className="image_container">
                {data?.images && data?.images?.length > 0 ? (
                    <img className="image" key={0} src={data?.images[0]} style={{ borderRadius: '10px' }} />
                ) : null}
            </div>
            <div className="title">
                <span>
                    {data?.name?.split(' ')?.slice(0, 3)?.join(' ') || ''}..
                </span>
            </div>
            <div className="action">
                <div className="price">
                    <span
                        className="stock"
                        style={
                            data?.available === 'in stock'
                                ? { color: 'green' }
                                : { color: 'red' }
                        }
                    >
                        {data?.available}
                    </span>
                    <span
                        className="priceMaincart"
                        style={{ flexDirection: 'column', display: 'flex' }}
                    >
                        <span className="market-price">
                            {formatPriceInINR(data.marketPrice)}
                        </span>{' '}
                        {formatPriceInINR(data?.price)}
                    </span>
                </div>

                {/* Colors */}
                {data?.colors && data.colors.length > 0 && (
                    <div className="product-colors" style={{ marginTop: '0px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {data?.colors.map((color, index) => (
                                <span
                                    key={index}
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        border: '1px solid #ddd',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Flavors */}
                {data?.flavors && data.flavors.length > 0 && (
                    <div className="product-flavors" style={{ marginTop: '0px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {data?.flavors.map((flavor, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '5px 8px',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {flavor}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
