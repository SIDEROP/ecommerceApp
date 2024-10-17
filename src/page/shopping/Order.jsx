import React, { useEffect } from 'react';
import '../css/Order.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, refundOrder } from '../../store/slices/orderSlice';
import AlertBox from '../../components/ui/AlertBox';

const Order = () => {
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth.reLogin
    );
    const {
        ordersList: { orders },
        orderRefund: { loading },
    } = useSelector((state) => state.order);

    let navigate = useNavigate();
    let dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated && user.role !== 'user') {
            return navigate('ecommerceApp/auth', { replace: true });
        }
        dispatch(getAllOrders());
    }, [isAuthenticated, dispatch]);

    return (
        <>
            <div className="Order">
                <div className="OrderData">
                    {orders && orders?.length > 0 ? null : (
                        <AlertBox
                            path=""
                            title={'no order add to cart and buy now'}
                        />
                    )}
                    {orders &&
                        orders?.length > 0 &&
                        orders?.map((order, i) => (
                            <div className="orderList" key={i}>
                                <div
                                    className={`data ${Array.isArray(order?.products) ? 'dataAll' : null}`}
                                >
                                    {Array.isArray(order?.products) ? (
                                        order?.products?.map(
                                            (product, index) => (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `ecommerceApp/product/${product?._id}`
                                                        );
                                                    }}
                                                    key={index}
                                                    className="productItem productItemAll"
                                                >
                                                    <span className="img">
                                                        {product?.images &&
                                                        product?.images
                                                            ?.length > 0 ? (
                                                            <img
                                                                key={0}
                                                                src={
                                                                    product
                                                                        ?.images[0]
                                                                }
                                                            />
                                                        ) : null}
                                                    </span>
                                                    <div className="name">
                                                        <h4>{product?.name}</h4>
                                                        <span>
                                                            ₹{product?.price}
                                                        </span>
                                                        <span>
                                                            Qty{' '}
                                                            {product?.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div
                                            className="productItem"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    `ecommerceApp/product/${order?.productId?._id}`
                                                );
                                            }}
                                        >
                                            <span className="img">
                                                {order?.products?.images &&
                                                order?.products?.images
                                                    ?.length > 0 ? (
                                                    <img
                                                        key={0}
                                                        src={
                                                            order?.products
                                                                .images[0]
                                                        }
                                                    />
                                                ) : null}
                                            </span>
                                            <div className="name">
                                                <h4>{order?.products?.name}</h4>
                                                <span>
                                                    ₹{order?.products?.price}
                                                </span>
                                                <span>
                                                    Qty{' '}
                                                    {order?.products?.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="info">
                                    <div className="Address">
                                        <span>
                                            <b>Delivery Address:</b>
                                        </span>
                                        <span style={{fontSize:"10px"}}>
                                            {user?.address?.city}
                                        </span>
                                        <span style={{fontSize:"10px"}}>
                                            {user?.address?.street}
                                        </span>
                                        <span style={{fontSize:"10px"}}>
                                            {user?.address?.postalCode}
                                        </span>
                                        <span style={{fontSize:"10px"}}>
                                            {user?.address?.contacts}
                                        </span>
                                    </div>
                                    <div className="mainData">
                                        <div className="name">
                                            <span>
                                                Total: ₹{order?.totalAmount}
                                            </span>
                                            <span
                                                style={
                                                    order?.status ===
                                                        'pandin' ||
                                                    order?.status === 'canceled'
                                                        ? { color: 'red' }
                                                        : { color: 'green' }
                                                }
                                            >
                                                {order?.status}
                                            </span>
                                        </div>
                                        <a
                                            href={order?.invoicePdf}
                                            download="optional-file-name.pdf"
                                        >
                                            Download Invoice
                                        </a>
                                        {order?.status == 'pandin' ||
                                        order?.status == 'canceled' ? null : (
                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        refundOrder(
                                                            order?.orderId
                                                        )
                                                    )
                                                }
                                            >
                                                Refund
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Order;
