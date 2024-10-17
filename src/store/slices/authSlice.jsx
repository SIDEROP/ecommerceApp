import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { parseErrorMessage } from '../../utils/parseErrorMessage';
import {VITE_API_URL} from "../../data"

// const { VITE_API_URL } = import.meta.env;

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/auth/registerUser`,
                data,
                {
                    withCredentials: true,
                }
            );
            const token = response.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                className: 'toast toast-error',
            });
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/auth/loginUser`,
                data,
                {
                    withCredentials: true,
                }
            );
            const { token } = response.data?.data;
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                className: 'toast toast-error',
            });
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/auth/loginAdmin`,
                data,
                {
                    withCredentials: true,
                }
            );
            const token = response.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                className: 'toast toast-error',
            });
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const reLoginUser = createAsyncThunk(
    'auth/reLoginUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/auth/reLogin`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/auth/logoutUser`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            localStorage.removeItem('token');
            toast.success(response.data?.message, {
                className: 'toast toast-success',
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ data }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.put(
                `${VITE_API_URL}/auth/updateUser`,
                data,
                {
                    withCredentials: true,

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success(response.data?.message, {
                className: 'toast toast-success',
            });
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                className: 'toast toast-error',
            });
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        register: {
            data: [],
            loading: false,
            error: null,
        },
        login: {
            data: null,
            loading: false,
            error: null,
        },
        loginAdmin: {
            data: [],
            loading: false,
            error: null,
        },
        reLogin: {
            isAuthenticated: false,
            user: {
                role: false,
            },
            loading: false,
            error: null,
        },
        logout: {
            loading: false,
            error: null,
        },
        updateUser: {
            loading: false,
            error: null,
            success: false,
        },
    },
    reducers: {
        updateUserAddress: (state, action) => {
            let { user } = state.reLogin;
            if (state.reLogin.user) {
                state.reLogin.user = { ...user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.register.loading = true;
                state.register.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.register.loading = false;
                state.register.data.push(action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.register.loading = false;
                state.register.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.login.loading = true;
                state.login.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.login.loading = false;
                state.login.data = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.login.loading = false;
                state.login.error = action.payload;
            })
            .addCase(loginAdmin.pending, (state) => {
                state.loginAdmin.loading = true;
                state.loginAdmin.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loginAdmin.loading = false;
                state.loginAdmin.data.push(action.payload);
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loginAdmin.loading = false;
                state.loginAdmin.error = action.payload;
            })

            .addCase(reLoginUser.pending, (state) => {
                state.reLogin.loading = true;
                state.reLogin.error = null;
            })
            .addCase(reLoginUser.fulfilled, (state, action) => {
                state.reLogin.loading = false;
                state.reLogin.isAuthenticated = true;
                state.reLogin.user = action.payload;
            })
            .addCase(reLoginUser.rejected, (state, action) => {
                state.reLogin.loading = false;
                state.reLogin.isAuthenticated = false;
                state.reLogin.error = action.payload;
            })

            .addCase(logoutUser.pending, (state) => {
                state.logout.loading = true;
                state.logout.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.logout.loading = false;
                state.reLogin.isAuthenticated = false;
                state.reLogin.user = {};
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logout.loading = false;
                state.logout.error = action.payload;
            })

            .addCase(updateUser.pending, (state) => {
                state.updateUser.loading = true;
                state.updateUser.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updateUser.loading = false;
                state.updateUser.success = true;
                state.reLogin.user = {
                    ...state.reLogin.user,
                    ...action.payload?.data,
                };
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updateUser.loading = false;
                state.updateUser.error = action.payload;
                state.updateUser.success = false;
            });
    },
});

export const { updateUserAddress } = AuthSlice.actions;
export default AuthSlice.reducer;
