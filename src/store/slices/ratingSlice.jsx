import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import {VITE_API_URL} from "../../data"

// const { VITE_API_URL } = import.meta.env;

const initialState = {
    ratings: [],
    loading: false,
    error: null,
};
// Async thunk for fetching ratings and comments
export const fetchRatingsComments = createAsyncThunk(
    'ratings/fetchRatingsComments',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/rating/${productId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Async thunk for creating a rating and comment
export const createRatingComment = createAsyncThunk(
    'ratings/createRatingComment',
    async (data, { rejectWithValue }) => {
        console.log(data);
        try {
            const response = await axios.post(`${VITE_API_URL}/rating`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Comment rating added!', {
                className: 'toast toast-success',
            });
            return response.data.ratingComment;
        } catch (error) {
            toast.error('Failed to add comment rating.', {
                className: 'toast toast-error',
            });
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Async thunk for updating a rating and comment
export const updateRatingComment = createAsyncThunk(
    'ratings/updateRatingComment',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${VITE_API_URL}/rating/${id}`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Comment rating updated!', {
                className: 'toast toast-success',
            });
            return response.data.updatedRatingComment;
        } catch (error) {
            toast.error('Failed to update comment rating.', {
                className: 'toast toast-error',
            });
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Async thunk for deleting a rating and comment
export const deleteRatingComment = createAsyncThunk(
    'ratings/deleteRatingComment',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${VITE_API_URL}/rating/${id}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Comment deleted successfully!', {
                className: 'toast toast-success',
            });
            return id;
        } catch (error) {
            toast.error('please try again.', {
                className: 'toast toast-error',
            });
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const ratingSlice = createSlice({
    name: 'ratings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch ratings and comments
            .addCase(fetchRatingsComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRatingsComments.fulfilled, (state, action) => {
                state.loading = false;
                state.ratings = action.payload;
            })
            .addCase(fetchRatingsComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create rating and comment
            .addCase(createRatingComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRatingComment.fulfilled, (state, action) => {
                state.loading = false;
                state.ratings.push(action.payload);
            })
            .addCase(createRatingComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update rating and comment
            .addCase(updateRatingComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRatingComment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ratings.findIndex(
                    (rating) => rating._id === action.payload._id
                );
                if (index !== -1) {
                    state.ratings[index] = action.payload;
                }
            })
            .addCase(updateRatingComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete rating and comment
            .addCase(deleteRatingComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRatingComment.fulfilled, (state, action) => {
                state.loading = false;
                state.ratings = state.ratings.filter(
                    (rating) => rating._id !== action.payload
                );
            })
            .addCase(deleteRatingComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearError } = ratingSlice.actions;

export default ratingSlice.reducer;
