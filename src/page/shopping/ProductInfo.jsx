import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../store/slices/productSlice';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import '../css/ProductInfo.css';
import { FaHeart, FaShareAlt, FaStar } from 'react-icons/fa'; 
import { MdAddShoppingCart } from 'react-icons/md';
import Description from '../../components/Description';
import { addProductToCart, getCart } from '../../store/slices/cartSlice';
import {
    createRatingComment,
    fetchRatingsComments,
    deleteRatingComment,
} from '../../store/slices/ratingSlice';
import { FiDelete } from 'react-icons/fi';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import ImageModal from '../../components/ui/ImageModel'; 

const ProductInfo = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth?.reLogin
    );
    const { product, loading, error } = useSelector(
        (state) => state.product?.productOne
    );
    const {
        ratings,
        loading: ratingsLoading,
        error: ratingsError,
    } = useSelector((state) => state?.rating);

    const [quantity, setQuantity] = useState(1); 
    const [selectedRating, setSelectedRating] = useState(0); 
    const [newComment, setNewComment] = useState(''); 
    const [modalOpen, setModalOpen] = useState(false); 
    const [productData, setProductData] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFlavor, setSelectedFlavor] = useState('');

    useEffect(() => {
        dispatch(getProductById(productId));
        dispatch(fetchRatingsComments(productId));
    }, [dispatch, productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };


    const getAvailabilityMessage = () => {
        if (product.available === 'in stock') {
            return <p className="availability available">Available</p>;
        } else if (product.available === 'pre-order') {
            return (
                <p className="availability available">
                    Available for Pre-Order | Stock: {product?.stock}
                </p>
            );
        } else {
            return <p className="availability not-available">Not Available</p>;
        }
    };
    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity((prevQuantity) =>
            prevQuantity > 1 ? prevQuantity - 1 : 1
        );
    };

    const handleAddToWishlist = () => {
        if (!isAuthenticated || user?.role !== 'user') {
            return navigate('ecommerceApp/auth');
        }
        dispatch(addToWishlist(productId));
    };

    const handleShare = () => {
        navigator.clipboard
            .writeText(window?.location?.href)
            .then(() => {
                toast.success('Link copied to clipboard!', {
                    className: 'toast toast-success',
                });
            })
            .catch((error) => {
                toast.error('Failed to copy the link. Please try again.', {
                    className: 'toast toast-error',
                });
            });
    };

    const handleAddComment = () => {
        if (!isAuthenticated || user?.role !== 'user') {
            return navigate('ecommerceApp/auth');
        }
        if (newComment && selectedRating > 0) {
            dispatch(
                createRatingComment({
                    productId,
                    comment: newComment,
                    rating: selectedRating,
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(fetchRatingsComments(productId));
                });
            setNewComment('');
            setSelectedRating(0);
        } else {
        }
    };

    const handleRatingClick = (index) => {
        setSelectedRating(index + 1);
    };

    const handleDeleteComment = (ratingId) => {
        dispatch(deleteRatingComment(ratingId));
    };

    return (
        <div className="product-info-container">
            <div className="product-info-containerBox">
                <div className="image-gallery">
                    <div>
                        <Zoom>
                            {product?.images && product?.images?.length > 0 ? ( 
                                <img
                                    key={0}
                                    src={product?.images[0]}
                                    className="main-image"
                                    style={{
                                        maxWidth: '100%',
                                        cursor: 'zoom-in',
                                        borderRadius: '10px',
                                    }}
                                />
                            ) : null}
                        </Zoom>
                    </div>
                    <div className="mltiImg">
                        {product?.images && product?.images.length > 0
                            ? product?.images?.map((val, i) => (
                                  <Zoom>
                                      <img key={i} src={val} />
                                  </Zoom>
                              ))
                            : null}
                    </div>
                </div>

                <div className="product-details">
                    <h2>{product?.name}</h2>

                    {/* Rating */}
                    <div className="product-rating">
                        <p>
                            Rating:{' '}
                            {ratings?.length > 0
                                ? (
                                      ratings?.reduce(
                                          (acc, curr) => acc + curr?.rating,
                                          0
                                      ) / ratings?.length
                                  ).toFixed(1)
                                : 0}{' '}
                            / 5
                        </p>
                        <div className="stars">
                            {Array?.from({ length: 5 }, (_, index) => (
                                <FaStar
                                    className="star-icon"
                                    key={index}
                                    color={
                                        index <
                                        (ratings?.length > 0
                                            ? ratings?.reduce(
                                                  (acc, curr) =>
                                                      acc + curr?.rating,
                                                  0
                                              ) / ratings?.length
                                            : 0)
                                            ? '#FFD700'
                                            : '#E4E5E9'
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <p className="pproductDecs">{product?.description}</p>
                    <p>
                        Price: {formatPrice(product?.price)}
                        <span className="market-price">
                            {formatPrice(product?.marketPrice)}
                        </span>
                    </p>
                    <p>Discount: {product?.discount}%</p>

                    {getAvailabilityMessage()}

                    {/* Quantity Selector */}
                    <div className="quantity-selector">
                        <button onClick={handleDecrement}>-</button>
                        <span>{quantity}</span>
                        <button onClick={handleIncrement}>+</button>
                    </div>
                    {/* Colors */}
                    {product?.colors?.length > 0 && (
                        <div className="colors-section">
                            <div className="colors">
                                {product?.colors?.map((color, index) => (
                                    <button
                                        key={index}
                                        style={{
                                            backgroundColor: color,
                                            border:
                                                selectedColor === color
                                                    ? '2px solid white'
                                                    : 'none',
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            margin: '5px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flavors */}
                    {product?.flavors?.length > 0 && (
                        <div className="flavors-section">
                            <select
                                value={selectedFlavor}
                                onChange={(e) =>
                                    setSelectedFlavor(e.target.value)
                                }
                            >
                                <option value="">Select Flavor</option>
                                {product?.flavors?.map((flavor, index) => (
                                    <option key={index} value={flavor}>
                                        {flavor}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Add to Cart and Wishlist */}
                    <div className="addTobuy">
                        <button
                            className="add-to-cart-btn"
                            onClick={() => {
                                if (!isAuthenticated && user.role !== 'user') {
                                    return navigate('ecommerceApp/auth');
                                }
                                dispatch(
                                    addProductToCart({
                                        productId: product?._id,
                                        quantity,
                                    })
                                )
                                    .unwrap()
                                    .then(() => {
                                        dispatch(getCart());
                                    });
                            }}
                        >
                            <MdAddShoppingCart /> Add To Cart
                        </button>
                        <button
                            className="wishlist-btn"
                            onClick={handleAddToWishlist}
                        >
                            <FaHeart color={product.isInWishlist?'red':null}/> Wishlist
                        </button>
                        <button className="share-btn" onClick={handleShare}>
                            <FaShareAlt  /> Share
                        </button>
                    </div>

                    <hr style={{ width: '100%' }} />
                    <div className="delivery-info">
                        <p>Estimated delivery: 5-7 Days from order date.</p>
                        <p>Free Shipping & Returns: On orders above ₹999</p>
                        <p>Secure Payments</p>
                        <p>COD Available</p>
                        <p>Easy returns and Exchange</p>
                    </div>
                </div>
            </div>
            <Description />
            <div className="productRating">
                <div className="user-rating-section">
                    <h3>Rate this product</h3>

                    <div className="star">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FaStar
                                className="star-icon"
                                key={index}
                                color={
                                    index < selectedRating
                                        ? '#FFD700'
                                        : '#E4E5E9'
                                }
                                onClick={() => handleRatingClick(index)}
                            />
                        ))}
                    </div>
                    <textarea
                        className="comment"
                        placeholder="Enter your comment here"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button className="submit-btn" onClick={handleAddComment}>
                        Submit
                    </button>
                </div>

                <div className="existing-comments-section">
                    <h3>Comments</h3>
                    {ratingsLoading ? (
                        <p>Loading comments...</p>
                    ) : ratingsError ? (
                        <p>Error loading comments: {ratingsError}</p>
                    ) : ratings.length > 0 ? (
                        <ul className="comments-list" style={{overflowX:"auto",height:"300px",width:"100%"}}>
                            {ratings.map((rating) => (
                                <li key={rating?._id}>
                                    <p style={{ color: '#ffd900a8' }}>
                                        {rating?.comment}
                                    </p>
                                    <div className="rating">
                                        {Array?.from({ length: 5 }).map(
                                            (_, index) => (
                                                <FaStar
                                                    className="star-icon"
                                                    key={index}
                                                    color={
                                                        index < rating?.rating
                                                            ? '#FFD700'
                                                            : '#E4E5E9'
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                    {console.log(rating)}
                                    {isAuthenticated &&
                                        user?.role === 'user' &&
                                        user?._id == rating?.user?._id && (
                                            <button
                                                onClick={() => {
                                                    handleDeleteComment(
                                                        rating?._id
                                                    );
                                                }}
                                            >
                                                <FiDelete /> Delete
                                            </button>
                                        )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>

            {/* Modal for showing the clicked image */}
            {modalOpen && (
                <ImageModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    product={productData?.images}
                />
            )}
        </div>
    );
};

export default ProductInfo;
