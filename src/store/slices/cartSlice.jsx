import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateOrderStatus } from './orderSlice';
import toast from 'react-hot-toast';
const { VITE_API_URL } = import.meta.env;
const localUrl = 'https://ecommerce-ohkj.onrender.com/api/v1'

// Add product to cart thunk (createCart API)
export const addProductToCart = createAsyncThunk(
    'cart/addProductToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL || localUrl}/cart/createCart`,
                { productId, quantity },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Product added to cart successfully.', {
                className: 'toast toast-success',
            });
            return response.data.data;
        } catch (error) {
            toast.success('Error adding product to cart', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Get cart thunk (fetch user's cart)
export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.get(`${VITE_API_URL || localUrl}/cart/getCart`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Async action to remove a product from the cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${VITE_API_URL || localUrl}/cart/removeFromCart/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Product remove to cart successfully.', {
                className: 'toast toast-success',
            });
            return response.data; // Assuming response returns updated cart
        } catch (error) {
            toast.success('Error removing product to cart', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        addCart: {
            loading: false,
            error: null,
        },
        fetchCart: {
            cart: [],
            loading: false,
            error: null,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add product to cart
            .addCase(addProductToCart.pending, (state) => {
                state.addCart.loading = true;
                state.addCart.error = null;
            })
            .addCase(addProductToCart.fulfilled, (state, action) => {
                state.addCart.loading = false;
            })
            .addCase(addProductToCart.rejected, (state, action) => {
                state.addCart.loading = false;
                state.addCart.error = action.payload;
            })
            // Get user's cart
            .addCase(getCart.pending, (state) => {
                state.fetchCart.loading = true;
                state.fetchCart.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.fetchCart.loading = false;
                state.fetchCart.cart = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.fetchCart.loading = false;
                state.fetchCart.error = action.payload;
            })
            // Remove product from cart
            .addCase(removeFromCart.pending, (state) => {
                state.addCart.loading = true;
                state.addCart.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.addCart.loading = false;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.addCart.loading = false;
                state.addCart.error = action.payload;
            });
    },
});

export const { actions } = cartSlice;
export default cartSlice.reducer;
