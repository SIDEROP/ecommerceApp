import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateUserAddress } from './authSlice';
import toast from 'react-hot-toast';
import {VITE_API_URL} from "../../data"

// const { VITE_API_URL } = import.meta.env;

// Create or Update Address
export const createOrUpdateAddress = createAsyncThunk(
    'address/createOrUpdateAddress',
    async (addressData, { rejectWithValue, getState ,dispatch}) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/address/create`,
                addressData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            dispatch(updateUserAddress({address:response?.data?.data}))
            toast.success("save address", {
                className: 'toast toast-success',
            });

            return response.data
        } catch (error) {
            toast.error("not save address", {
                className: 'toast toast-error',
            });
            return rejectWithValue(
                error.response?.data?.message || 'Error saving address'
            );
        }
    }
);

// Initial state
const initialState = {
    address: null,
    loading: false,
    error: null,
};

// Slice
const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        resetAddressState: (state) => {
            state.address = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Create or Update Address
        builder
            .addCase(createOrUpdateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrUpdateAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.address = action.payload.address; // Set the created/updated address
                state.error = null;
            })
            .addCase(createOrUpdateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAddressState } = addressSlice.actions;
export const selectAddressState = (state) => state.address;
export default addressSlice.reducer;
