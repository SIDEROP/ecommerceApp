import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../store/slices/productSlice';

const RandomProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchResults, loading, error } = useSelector(
        (state) => state.product.search
    );

    useEffect(() => {
        dispatch(searchProducts());
    }, [dispatch]);

    // Format price in INR
    const formatPriceInINR = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="search-results-container home">
            <div className="searchBox-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                        <div
                            key={product._id}
                            className="product-card"
                            onClick={() => navigate(`/product/${product?._id}`)}
                        >
                            {product?.images && product?.images?.length > 0 ? (
                                <img
                                    className="product-image"
                                    key={0}
                                    src={product?.images[0]}
                                    style={{ borderRadius: '10px' }}
                                />
                            ) : null}
                            <div className="product-details">
                                <h4>
                                    {product?.name
                                        ?.split(' ')
                                        ?.slice(0, 3)
                                        ?.join(' ') || ''}
                                    ...
                                </h4>
                                <p className="stockTag"
                                    style={
                                        product?.available === 'in stock' ||
                                        product?.available === 'pre-order'
                                            ? { color: 'green' }
                                            : { color: 'red' }
                                    }
                                >
                                    {product?.available}
                                </p>
                                <div className="prdata">
                                    <p className="p">
                                        <span className="market-price">
                                            {formatPriceInINR(product?.marketPrice)}
                                        </span>{' '}
                                        {''}
                                        <span>
                                            {formatPriceInINR(product?.price)}
                                        </span>
                                    </p>
                                </div>

                                {/* Colors */}
                                {product?.colors && product?.colors.length > 0 && (
                                    <div className="product-colors" style={{ marginTop: '0px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {product?.colors.map((color, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
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
                                {product?.flavors && product?.flavors.length > 0 && (
                                    <div className="product-flavors" style={{ marginTop: '0px' }}>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product?.flavors.map((flavor, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        backgroundColor: '#f5f5f5',
                                                        padding: '5px 10px',
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
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default RandomProduct;
