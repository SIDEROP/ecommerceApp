import React, { useEffect, useState } from 'react';
import '../css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';
import { MdOutlineCancel } from 'react-icons/md';
import AlertBox from '../../components/ui/AlertBox';
import toast from 'react-hot-toast';

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

const calculateTotals = (cart) => {
    let subtotal = 0;
    let totalDiscount = 0;

    cart?.products?.forEach((item) => {
        const product = item?.productId;
        const quantity = item?.quantity || 1;
        const price = product?.price || 0;
        const discount = product?.discount || 0;

        subtotal += price * quantity;

        const discountAmount = (price * discount * quantity) / 100;
        totalDiscount += discountAmount;
    });

    const finalTotal = subtotal - totalDiscount;

    return {
        subtotal,
        totalDiscount,
        finalTotal,
    };
};

const Cart = () => {
    const { isAuthenticated, user } = useSelector(
        (state) => state?.auth?.reLogin
    );
    const [selectedColors, setSelectedColors] = useState({});
    const [selectedFlavors, setSelectedFlavors] = useState({});

    const {
        fetchCart: { cart },
    } = useSelector((state) => state.cart);
    let navigate = useNavigate();
    let dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'user') {
            return navigate('ecommerceApp/auth', { replace: true });
        }
        dispatch(getCart());
    }, [isAuthenticated, user, dispatch, navigate]);

    const { subtotal, totalDiscount, finalTotal } = calculateTotals(cart);

    const handleCreateOrder = (selectedProduct) => {
        const productId = selectedProduct?.productId?._id;

        // Check if the product has color options and if the user has selected one
        if (
            selectedProduct?.productId?.colors?.length > 0 &&
            !selectedColors[productId]
        ) {
            return toast.error('Please select a color for this product', {
                className: 'toast toast-error',
            });
        }

        // Check if the product has flavor options and if the user has selected one
        if (
            selectedProduct?.productId?.flavors?.length > 0 &&
            !selectedFlavors[productId]
        ) {
            return toast.error('Please select a flavor for this product', {
                className: 'toast toast-error',
            });
        }

        if (!user?.address?._id) {
            return toast.error('Add your address please', {
                className: 'toast toast-error',
            });
        }

        const orderDetails = {
            products: [
                {
                    ...selectedProduct,
                    selectedColor: selectedColors[productId] || null,
                    selectedFlavor: selectedFlavors[productId] || null,
                    address: user?.address,
                },
            ],
        };
        dispatch(createOrder(orderDetails));
    };

    return (
        <>
            <div className="Cart">
                <div className="cartList">
                    {(!cart || cart?.products?.length === 0) && (
                        <AlertBox
                            path=""
                            title={
                                'No products in your cart. Add items and buy now!'
                            }
                        />
                    )}
                    {cart &&
                        cart?.products?.length > 0 &&
                        cart?.products?.map((data, i) => (
                            <div
                            style={{cursor:"pointer"}}
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        `ecommerceApp/product/${data?.productId?._id}`
                                    );
                                }}
                            >
                                <div className="cartData">
                                    <span
                                        className="removeCart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(
                                                removeFromCart(
                                                    data?.productId?._id
                                                )
                                            ).then(() => dispatch(getCart()));
                                        }}
                                    >
                                        <MdOutlineCancel size={12} />
                                    </span>
                                    <div className="data">
                                        <span className="img">
                                            {data?.productId?.images?.length >
                                                0 && (
                                                <img
                                                    src={
                                                        data?.productId
                                                            ?.images[0]
                                                    }
                                                    alt={data?.productId?.name}
                                                />
                                            )}
                                        </span>

                                        <div className="name">
                                            <h4>
                                                {data?.productId?.name ||
                                                    'Product Name'}
                                            </h4>
                                            <span>
                                                {formatINR(
                                                    data?.productId?.price || 0
                                                )}
                                            </span>
                                            <span>
                                                {data?.productId?.category ||
                                                    'Category'}
                                            </span>
                                            <span>
                                                Qty {data?.quantity || 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="info">
                                        <span>
                                            {data?.productId?.discount || 0}%
                                            Off
                                        </span>

                                        {/* Colors */}
                                        {data?.productId?.colors?.length >
                                            0 && (
                                            <div className="colors-section">
                                                <div className="colors">
                                                    {data?.productId?.colors?.map(
                                                        (color, index) => (
                                                            <button
                                                                key={index}
                                                                style={{
                                                                    backgroundColor:
                                                                        color,
                                                                    border:
                                                                        selectedColors[
                                                                            data
                                                                                ?.productId
                                                                                ?._id
                                                                        ] ===
                                                                        color
                                                                            ? '2px solid white'
                                                                            : 'none',
                                                                    width: '14px',
                                                                    height: '14px',
                                                                    borderRadius:
                                                                        '50%',
                                                                    margin: '5px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setSelectedColors(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [data
                                                                                ?.productId
                                                                                ?._id]:
                                                                                color,
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Flavors */}
                                        {data?.productId?.flavors?.length >
                                            0 && (
                                            <div className="flavors-section">
                                                <select
                                                    value={
                                                        selectedFlavors[
                                                            data?.productId?._id
                                                        ] || ''
                                                    }
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFlavors(
                                                            (prev) => ({
                                                                ...prev,
                                                                [data?.productId
                                                                    ?._id]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        Select Flavor
                                                    </option>
                                                    {data?.productId?.flavors?.map(
                                                        (flavor, index) => (
                                                            <option
                                                                key={index}
                                                                value={flavor}
                                                            >
                                                                {flavor}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCreateOrder(
                                                    cart?.products[i]
                                                );
                                            }}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="payCart">
                    <div className="topBox">
                        <div>
                            <h1>Order Summary</h1>
                        </div>
                        <div>
                            <span>SubTotal</span>
                            <span>{formatINR(subtotal || 0)}</span>
                        </div>
                        <div>
                            <span>Discount</span>
                            <span>{formatINR(totalDiscount || 0)}</span>
                        </div>
                        <hr />
                        <div>
                            <span>Final Total</span>
                            <span>{formatINR(finalTotal || 0)}</span>
                        </div>
                        <div className="btnBox">
                            <span
                                className="btn"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    // Check if any product requires color/flavor selection and the user hasn't selected them
                                    for (let product of cart?.products) {
                                        const productId =
                                            product?.productId?._id;

                                        if (
                                            product?.productId?.colors?.length >
                                                0 &&
                                            !selectedColors[productId]
                                        ) {
                                            return toast.error(
                                                `Please select a color for ${product?.productId?.name}`,
                                                {
                                                    className:
                                                        'toast toast-error',
                                                }
                                            );
                                        }

                                        if (
                                            product?.productId?.flavors
                                                ?.length > 0 &&
                                            !selectedFlavors[productId]
                                        ) {
                                            return toast.error(
                                                `Please select a flavor for ${product?.productId?.name}`,
                                                {
                                                    className:
                                                        'toast toast-error',
                                                }
                                            );
                                        }
                                    }

                                    if (!user?.address?._id) {
                                        return toast.error(
                                            'Add your address please',
                                            {
                                                className: 'toast toast-error',
                                            }
                                        );
                                    }

                                    dispatch(
                                        createOrder({
                                            products: cart?.products.map(
                                                (product) => ({
                                                    ...product,
                                                    selectedColor:
                                                        selectedColors[
                                                            product?.productId
                                                                ?._id
                                                        ] || null,
                                                    selectedFlavor:
                                                        selectedFlavors[
                                                            product?.productId
                                                                ?._id
                                                        ] || null,
                                                    address: user?.address,
                                                })
                                            ),
                                        })
                                    );
                                }}
                            >
                                Secure Checkout
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
