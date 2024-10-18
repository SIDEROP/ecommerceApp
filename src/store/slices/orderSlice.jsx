import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
const { VITE_API_URL } = import.meta.env;
const localUrl = 'http://localhost:4000/api/v1'


// Create order thunk (createOrder API)
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (products, { rejectWithValue, dispatch }) => {
        try {
            // Make API request to create the order and retrieve the session ID
            const response = await axios.post(
                `${VITE_API_URL || localUrl}/paymentGateway/createOrder`,
                products,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const { sessionId, url, order } = response.data.data;
            window.location.href = `${url}`;
            dispatch(updateOrderStatus(order?._id));
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to create order'
            );
        }
    }
);

// Thunk to update order status after payment (webhook handling)
export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async (ProductOrderId, { rejectWithValue, getState }) => {
        try {
            const response = await axios.put(
                `${VITE_API_URL || localUrl}/paymentGateway/updateOrderStatus`,
                { ProductOrderId },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.data; // Returning the updated order
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to update order status'
            );
        }
    }
);

// Thunk to get all orders
export const getAllOrders = createAsyncThunk(
    'order/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL || localUrl}/order/getAllOrders`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to retrieve orders'
            );
        }
    }
);
// Thunk to refund an order
export const refundOrder = createAsyncThunk(
    'order/refundOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL || localUrl}/paymentGateway/refundOrder/${orderId}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('refund order successfully.', {
                className: 'toast toast-success',
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to refund order'
            );
        }
    }
);

// Thunk to fetch all user orders
export const fetchAllUserOrders = createAsyncThunk(
    'orders/fetchAllUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL || localUrl}/order/getAllUserOrders`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Async thunk for updating order status
export const updateOrderStatusAdmin = createAsyncThunk(
    'order/updateOrderStatusAdmin',
    async ({ orderId, status }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.put(
                `${VITE_API_URL || localUrl}/order/updateOrderStatusAdmin/${orderId}/status`,
                { status },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (status === 'refund') {
                await dispatch(refundOrder(orderId));
            }

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orderCrete: {
            order: null,
            sessionId: null,
            loading: false,
            error: null,
        },
        ordersList: {
            orders: [],
            loading: false,
            error: null,
        },
        orderUpdate: {
            order: null,
            loading: false,
            error: null,
        },
        orderCancel: {
            order: null,
            loading: false,
            error: null,
        },
        orderRefund: {
            order: null,
            loading: false,
            error: null,
        },
        allUserOrders: {
            orders: [],
            loading: false,
            error: null,
        },
        updateOrder: {
            orders: [],
            loading: false,
            error: null,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.orderCrete.loading = true;
                state.orderCrete.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orderCrete.loading = false;
                state.orderCrete.order = action.payload.order;
                state.orderCrete.sessionId = action.payload.sessionId;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.orderCrete.loading = false;
                state.orderCrete.error = action.payload;
            })
            .addCase(getAllOrders.pending, (state) => {
                state.ordersList.loading = true;
                state.ordersList.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.ordersList.loading = false;
                state.ordersList.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.ordersList.loading = false;
                state.ordersList.error = action.payload;
            })
            // Handle order status update (after payment)
            .addCase(updateOrderStatus.pending, (state) => {
                state.orderUpdate.loading = true;
                state.orderUpdate.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.orderUpdate.loading = false;
                state.orderUpdate.order = action.payload;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.orderUpdate.loading = false;
                state.orderUpdate.error = action.payload;
            })
            .addCase(refundOrder.pending, (state) => {
                state.orderRefund.loading = true;
                state.orderRefund.error = null;
            })
            .addCase(refundOrder.fulfilled, (state, action) => {
                state.orderRefund.loading = false;
                state.orderRefund.order = action.payload;
            })
            .addCase(refundOrder.rejected, (state, action) => {
                state.orderRefund.loading = false;
                state.orderRefund.error = action.payload;
            })
            .addCase(fetchAllUserOrders.pending, (state) => {
                state.allUserOrders.loading = true;
                state.allUserOrders.error = null;
            })
            .addCase(fetchAllUserOrders.fulfilled, (state, action) => {
                state.allUserOrders.loading = false;
                state.allUserOrders.orders = action.payload;
            })
            .addCase(fetchAllUserOrders.rejected, (state, action) => {
                state.allUserOrders.loading = false;
                state.allUserOrders.error = action.payload;
            })
            .addCase(updateOrderStatusAdmin.pending, (state) => {
                state.updateOrder.loading = true;
                state.updateOrder.error = null;
            })
            .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
                state.updateOrder.loading = false;
                const updatedOrder = action.payload;
                const index = state.allUserOrders.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );

                if (index !== -1) {
                    state.allUserOrders.orders[index].status =
                        updatedOrder.status;
                }
            })
            .addCase(updateOrderStatusAdmin.rejected, (state, action) => {
                state.updateOrder.loading = false;
                state.updateOrder.error =
                    action.payload.message || 'Failed to update order status';
            });
    },
});

export const { actions } = orderSlice;
export default orderSlice.reducer;
