import '../css/SearchProduct.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts } from '../../store/slices/productSlice';
import { addProductToCart } from '../../store/slices/cartSlice';
import Loader from "../../components/ui/Loder";

const SearchProduct = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    let navigate = useNavigate();
    const { searchResults, loading, error } = useSelector(
        (state) => state.product.search
    );

    useEffect(() => {
        if (query) {
            dispatch(searchProducts(query));
        }
    }, [query, dispatch]);

    if (loading) {
        return <Loader />;
    }

    // Format price in INR
    const formatPriceInINR = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="search-results-container">
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
                            {product?.images &&
                            product?.images?.length > 0 ? (
                                <img key={0} src={product?.images[0]} />
                            ) : null}
                            <div className="product-details" >
                                <h4>
                                    {product.name
                                        .split(' ')
                                        .slice(0, 8)
                                        .join(' ')}
                                    ...
                                </h4>
                                <p
                                    style={{
                                        color:
                                            product?.available === 'in stock' ||
                                            product?.available === 'pre-order'
                                                ? 'green'
                                                : 'red',
                                    }}
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
                                {product?.colors && product.colors.length > 0 && (
                                    <div className="product-colors" style={{ marginTop: '10px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {product.colors.map((color, index) => (
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
                                {product?.flavors && product.flavors.length > 0 && (
                                    <div className="product-flavors" style={{ marginTop: '10px' }}>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product.flavors.map((flavor, index) => (
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
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default SearchProduct;
