import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { productOneWislistToggle } from './productSlice';
import {VITE_API_URL} from "../../data"

// const { VITE_API_URL } = import.meta.env;

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/wishlist/add`,
                { productId },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            let { isInWishlist } = response?.data?.data;
            dispatch(productOneWislistToggle(isInWishlist));
            return response.data;
        } catch (error) {
            toast.error('Failed to add product to wishlist', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data);
        }
    }
);

// Get user's wishlist
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/wishlist`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(response?.data?.data);
            return response.data?.data;
        } catch (error) {
            toast.error('Failed to load wishlist');
            return rejectWithValue(error.response.data);
        }
    }
);

// Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${VITE_API_URL}/wishlist/remove/${productId}`,

                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Product removed from wishlist');
            return { productId };
        } catch (error) {
            toast.error('Failed to remove product from wishlist');
            return rejectWithValue(error.response.data);
        }
    }
);

// Wishlist slice
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlist: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist.push(action.payload?.data?.wishlist);
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.products;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = state.wishlist.filter(
                    (item) => item.product._id !== action.payload.productId
                );
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default wishlistSlice.reducer;
