// dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const { VITE_API_URL } = import.meta.env;
const localUrl = 'http://localhost:4000/api/v1'


// Thunk for fetching dashboard summary
export const fetchDashboardSummary = createAsyncThunk(
    'dashboard/fetchSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL || localUrl}/dashboard/summary`,
                {
                    withCredentials: true ,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    'Failed to fetch dashboard summary'
            );
        }
    }
);

// Thunk for fetching daily earnings
export const fetchDailyEarnings = createAsyncThunk(
    'dashboard/fetchDailyEarnings',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        console.log( startDate, endDate)
        try {
            const response = await axios.get(
                `${VITE_API_URL || localUrl}/dashboard/fetchDailyEarnings?startDate=${startDate}&endDate=${endDate}`,
                {
                    withCredentials: true ,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(response.data)
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch daily earnings'
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        fetchDashboardSummary: {
            dashboardData: null,
            loading: false,
            error: null,
        },

        fetchDailyEarnings: {
            dailyEarningsdata: [],
            loading: false,
            error: null,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.fetchDashboardSummary.loading = true;
                state.fetchDashboardSummary.error = null;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.fetchDashboardSummary.loading = false;
                state.fetchDashboardSummary.dashboardData = action.payload;
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.fetchDashboardSummary.loading = false;
                state.fetchDashboardSummary.error = action.payload;
            })
            .addCase(fetchDailyEarnings.pending, (state) => {
                state.fetchDailyEarnings.loading = true;
                state.fetchDailyEarnings.error = null;
            })
            .addCase(fetchDailyEarnings.fulfilled, (state, action) => {
                state.fetchDailyEarnings.loading = false;
                state.fetchDailyEarnings.dailyEarningsdata = action.payload;
            })
            .addCase(fetchDailyEarnings.rejected, (state, action) => {
                state.fetchDailyEarnings.loading = false;
                state.fetchDailyEarnings.error = action.payload;
            });
    },
});

// Export actions and reducer
export default dashboardSlice.reducer;
