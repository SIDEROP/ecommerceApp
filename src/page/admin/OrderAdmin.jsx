import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import './css/OrderAdmin.css';
import {
    fetchAllUserOrders,
    updateOrderStatusAdmin,
} from '../../store/slices/orderSlice';
import Modal from '../../components/ui/Modal';
import Loder from '../../components/ui/Loder';

const OrderAdmin = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(
        (state) => state.order.allUserOrders
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Date Range State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchAllUserOrders());
    }, [dispatch]);

    if (loading) {
        return <Loder />;
    }

    const filteredOrders = orders?.filter((order) => {
        const products = Array.isArray(order.products)
            ? order.products
            : [order.products];

        const productMatches = products?.some(
            (product) =>
                product.name
                    ?.toLowerCase()
                    ?.includes(searchTerm.toLowerCase()) ||
                product.description
                    ?.toLowerCase()
                    ?.includes(searchTerm.toLowerCase())
        );

        const priceMatches = products?.some((product) =>
            product.price?.toString()?.includes(searchTerm)
        );

        const matchesStatus = selectedStatus
            ? order?.status === selectedStatus
            : true;

        // Date Range Filtering
        const orderDate = new Date(order.createdAt);
        const isInDateRange =
            (!startDate || orderDate >= new Date(startDate)) &&
            (!endDate || orderDate <= new Date(endDate));

        return (
            (productMatches || priceMatches) && matchesStatus && isInDateRange
        );
    });

    const totalCounts = orders?.reduce(
        (acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        },
        {
            pending: 0,
            paid: 0,
            refunded: 0,
            dispatched: 0,
            delivered: 0,
            canceled: 0,
            completed: 0,
        }
    );

    const filteredCounts = filteredOrders?.reduce(
        (acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        },
        {
            pending: 0,
            paid: 0,
            refunded: 0,
            dispatched: 0,
            delivered: 0,
            canceled: 0,
            completed: 0,
        }
    );

    const Row = ({ index }) => {
        const order = filteredOrders[index];
        const products = Array.isArray(order?.products)
            ? order.products
            : [order.products];

        return (
            <div
                style={{ cursor: 'pointer' }}
                className="orderCard"
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(order);
                }}
            >
                <div className="productsList">
                    {products && products?.length === 1 ? (
                        // Display the single product
                        <div className="productItem">
                            {products[0]?.images &&
                            products[0]?.images?.length > 0 ? ( // Check if images exist and have a length
                                <img
                                    key={0}
                                    src={products[0]?.images[0]}
                                    className="productImage"
                                /> // Render the first image
                            ) : null}
                            <p>
                                <span>Product:</span>{' '}
                                {products[0]?.name
                                    ?.split(' ')
                                    .slice(0, 5)
                                    .join(' ') + '..'}
                            </p>
                            <p>
                                <span>Price:</span> ₹
                                {products[0]?.price?.toFixed(2)}
                            </p>
                        </div>
                    ) : products && products?.length > 1 ? (
                        <p>products available {products && products?.length}</p>
                    ) : (
                        <p>No products available</p>
                    )}
                </div>

                <p>
                    <span>Name:</span> {order?.username}
                </p>
                <p>
                    <span>Status:</span> {order?.status}
                </p>
                <p>
                    <span>Date:</span> {new Date(order?.createdAt).toLocaleDateString('en-GB')}
                </p>
                <div className="orderActions">
                    <button
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                        }}
                    >
                        View
                    </button>
                </div>
            </div>
        );
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setNewStatus(order?.status);
        setCurrentIndex(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setCurrentIndex(0); // Reset index when closing modal
    };

    const nextProduct = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === selectedOrder.products.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevProduct = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? selectedOrder.products.length - 1 : prevIndex - 1
        );
    };

    const handleStatusUpdate = () => {
        if (selectedOrder && newStatus) {
            dispatch(
                updateOrderStatusAdmin({
                    orderId: selectedOrder?._id,
                    status: newStatus,
                })
            );
            closeModal();
        }
    };

    return (
        <div className="OrderAdmin">
            {/* Search and filter inputs */}
            <div className="searchAdminProduct">
                <span>
                    <h4>Order List</h4>
                    <div className="serchOrderAdmin">
                        <input
                            type="text"
                            placeholder="Search by product name, description, or price"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                            <option value="completed">completed</option>
                        </select>

                        <input
                            className="inputAdSerch"
                            type="date"
                            style={{ width: 'fit-content' }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            className="inputAdSerch"
                            style={{ width: 'fit-content' }}
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="orderCountAdmib">
                        <span>
                            <span>Pend:</span>{' '}
                            <span>
                                {filteredCounts.pending} / {totalCounts.pending}
                            </span>
                        </span>
                        <span>
                            <span>Paid:</span>
                            <span>
                                {filteredCounts.paid} / {totalCounts.paid}
                            </span>
                        </span>
                        <span>
                            <span>Refnd:</span>
                            <span>
                                {filteredCounts.refunded} /{' '}
                                {totalCounts.refunded}
                            </span>
                        </span>
                        <span>
                            <span>Disp:</span>
                            <span>
                                {filteredCounts.dispatched} /{' '}
                                {totalCounts.dispatched}
                            </span>
                        </span>
                        <span>
                            <span>Delvd:</span>
                            <span>
                                {filteredCounts.delivered} /{' '}
                                {totalCounts.delivered}
                            </span>
                        </span>
                        <span>
                            <span>Cancl:</span>
                            <span>
                                {filteredCounts.canceled} /{' '}
                                {totalCounts.canceled}
                            </span>
                        </span>
                        <span>
                            <span>Comp:</span>
                            <span>
                                {filteredCounts.completed} /{' '}
                                {totalCounts.completed}
                            </span>
                        </span>
                    </div>
                </span>
            </div>
            <div className="orderList">
                {filteredOrders && filteredOrders.length > 0 ? (
                    <List
                        className="dataDb"
                        height={500}
                        itemCount={filteredOrders.length}
                        itemSize={100}
                        width="100%"
                    >
                        {Row}
                    </List>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedOrder && (
                    <div>
                        <h3>Order Details</h3>
                        <div
                            className={
                                selectedOrder.products.length > 0
                                    ? 'productArr'
                                    : null
                            }
                        >
                            {Array.isArray(selectedOrder.products) &&
                            selectedOrder.products.length > 0 ? (
                                <div className="slider">
                                    <button onClick={prevProduct}>
                                        &#10094;
                                    </button>

                                    {selectedOrder?.products[currentIndex]
                                        ?.images &&
                                    selectedOrder?.products[currentIndex]
                                        ?.images?.length > 0 ? (
                                        <img
                                            key={0}
                                            src={
                                                selectedOrder?.products[
                                                    currentIndex
                                                ]?.images[0]
                                            }
                                            className="productImage"
                                        />
                                    ) : null}

                                    <div className="db">
                                        <p>
                                            <span className="titel">
                                                Product:
                                            </span>{' '}
                                            <span>
                                                {
                                                    selectedOrder?.products[
                                                        currentIndex
                                                    ]?.name
                                                }
                                            </span>
                                        </p>
                                        <p>
                                            <span className="titel">
                                                Price: ₹
                                            </span>
                                            <span>
                                                {selectedOrder?.products[
                                                    currentIndex
                                                ]?.price?.toFixed(2)}
                                            </span>
                                        </p>
                                        {selectedOrder?.products[currentIndex]
                                            ?.color && (
                                            <p>
                                                <span className="titel">
                                                    Color
                                                </span>
                                                <div className="colors-section">
                                                    <div className="colors">
                                                        <span
                                                            style={{
                                                                backgroundColor:
                                                                    selectedOrder
                                                                        ?.products[
                                                                        currentIndex
                                                                    ]?.color,

                                                                width: '10px',
                                                                height: '10px',
                                                                borderRadius:
                                                                    '50%',
                                                                margin: '5px',
                                                                cursor: 'pointer',
                                                            }}
                                                        ></span>
                                                    </div>
                                                </div>
                                            </p>
                                        )}

                                        {selectedOrder?.products[currentIndex]
                                            ?.flavors && (
                                            <p>
                                                <span className="titel">
                                                    flavors
                                                </span>
                                                <span>
                                                    {
                                                        selectedOrder?.products[
                                                            currentIndex
                                                        ]?.flavors
                                                    }
                                                </span>
                                            </p>
                                        )}

                                        {selectedOrder?.products[currentIndex]
                                            ?.size && (
                                            <p>
                                                <span className="titel">
                                                    Size
                                                </span>
                                                <span>
                                                    {
                                                        selectedOrder?.products[
                                                            currentIndex
                                                        ]?.size
                                                    }
                                                </span>
                                            </p>
                                        )}
                                        <p>
                                            <span className="titel">
                                                Quantity:
                                            </span>
                                            <span>
                                                {
                                                    selectedOrder?.products[
                                                        currentIndex
                                                    ]?.quantity
                                                }
                                            </span>
                                        </p>
                                    </div>
                                    <button onClick={nextProduct}>
                                        &#10095;
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={selectedOrder?.products?.image}
                                        className="productImage"
                                    />
                                    {selectedOrder?.products?.images &&
                                    selectedOrder?.products?.images?.length >
                                        0 ? ( // Check if images exist and have a length
                                        <img
                                            key={0}
                                            src={
                                                selectedOrder?.products
                                                    ?.images[0]
                                            }
                                            className="productImage"
                                        />
                                    ) : null}
                                    <p>
                                        <span className="titel">Product:</span>{' '}
                                        <span>
                                            {selectedOrder?.products?.name}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="titel">Price: ₹</span>
                                        <span>
                                            {selectedOrder?.products?.price?.toFixed(
                                                2
                                            )}
                                        </span>
                                    </p>

                                    <p>
                                        <span className="titel">Quantity:</span>
                                        <span>
                                            {selectedOrder?.products?.quantity}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <p>
                            <span className="titel">Customer Name:</span>{' '}
                            {selectedOrder?.username}
                        </p>
                        {selectedOrder?.totalAmount && (
                            <p>
                                <span className="titel">Total Amount:</span>{' '}
                                {selectedOrder?.totalAmount?.toFixed(2)}
                            </p>
                        )}
                        {selectedOrder?.shippingAddress && (
                            <p>
                                <span className="titel">shippingAddress:</span>{' '}
                                <div>
                                    {selectedOrder?.shippingAddress?.country}
                                </div>
                                <div>
                                    {selectedOrder?.shippingAddress?.city}
                                </div>
                                <div>
                                    {selectedOrder?.shippingAddress?.state}
                                </div>
                                <div>
                                    {selectedOrder?.shippingAddress?.postalCode}
                                </div>
                                <div>
                                    {selectedOrder?.shippingAddress?.street}
                                </div>
                                <div>
                                    {selectedOrder?.shippingAddress?.landmark}
                                </div>
                            </p>
                        )}
                        {selectedOrder?.invoicePdf && (
                            <button
                                className="btnUpdateProduct"
                                style={{ fontSize: '1rem' }}
                            >
                                <a
                                    href={selectedOrder.invoicePdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: '11px',
                                        color: 'green',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Download Invoice
                                </a>
                            </button>
                        )}
                        <p>
                            <span className="titel">Status:</span>{' '}
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="refunded">Refunded</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="delivered">Delivered</option>
                                <option value="canceled">Canceled</option>
                                <option value="completed">completed</option>
                            </select>
                        </p>
                        <button
                            className="btnUpdateProduct"
                            onClick={handleStatusUpdate}
                        >
                            Update Status
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderAdmin;
