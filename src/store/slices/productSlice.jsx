import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import {VITE_API_URL} from "../../data"

// const { VITE_API_URL } = import.meta.env;

// Get Products Thunk
export const getProducts = createAsyncThunk(
    'product/getProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/products/getProduct`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
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

// Create Product Thunk
export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${VITE_API_URL}/products/createProduct`,
                productData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Product created successfully!', {
                className: 'toast toast-success',
            });
            return response.data.data;
        } catch (error) {
            console.log(error);
            toast.error('Failed to upload product', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Update Product Thunk
export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${VITE_API_URL}/products/updateProduct/${id}`,
                productData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('Product updated successfully!', {
                className: 'toast toast-success',
            });
            return response.data.data;
        } catch (error) {
            toast.error('Failed to update product', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Delete Product Thunk
export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${VITE_API_URL}/products/deleteProduct/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Product deleted successfully!', {
                className: 'toast toast-success',
            });
            return productId;
        } catch (error) {
            toast.error('Failed to delete product', {
                className: 'toast toast-error',
            });
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Get Product By ID Thunk
export const getProductById = createAsyncThunk(
    'product/getProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/products/getProduct/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.data; // Adjust according to your API response structure
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
);

// Thunk to search products
export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async (searchQuery, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/products/searchProducts`,
                {
                    params: { search: searchQuery },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Error searching products'
            );
        }
    }
);

// Search products by category
export const searchProductsByCategory = createAsyncThunk(
    'products/searchProductsByCategory',
    async (searchQuery, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${VITE_API_URL}/products/searchCategory`,
                {
                    params: { search: searchQuery },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        productsAll: {
            products: [],
            loading: false,
            error: null,
        },
        createProduct: {
            loading: false,
            error: null,
            success: false,
        },
        updateProduct: {
            loading: false,
            error: null,
            success: false,
        },
        deleteProduct: {
            loading: false,
            error: null,
            success: false,
        },
        productOne: {
            product: {},
            loading: false,
            error: null,
        },
        search: {
            searchResults: [],
            loading: false,
            error: null,
        },
        categoryProduct: {
            products: [],
            loading: false,
            error: null,
        },
    },
    reducers: {
        productOneWislistToggle: (state, action) => {
            console.log(action.payload);
            state.productOne.product.isInWishlist = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.productsAll.loading = true;
                state.productsAll.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productsAll.loading = false;
                state.productsAll.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.productsAll.loading = false;
                state.productsAll.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.createProduct.loading = true;
                state.createProduct.error = null;
                state.createProduct.success = false;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.createProduct.loading = false;
                state.createProduct.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createProduct.loading = false;
                state.createProduct.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.updateProduct.loading = true;
                state.updateProduct.error = null;
                state.updateProduct.success = false;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.updateProduct.loading = false;
                state.updateProduct.success = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateProduct.loading = false;
                state.updateProduct.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.deleteProduct.loading = true;
                state.deleteProduct.error = null;
                state.deleteProduct.success = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteProduct.loading = false;
                state.deleteProduct.success = true;
                state.productsAll.products = state.productsAll.products.filter(
                    (product) => product._id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteProduct.loading = false;
                state.deleteProduct.error = action.payload;
            })
            // getProductById
            .addCase(getProductById.pending, (state) => {
                state.productOne.loading = true;
                state.productOne.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.productOne.loading = false;
                state.productOne.product = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.productOne.loading = false;
                state.productOne.error = action.payload;
            })
            // Search products cases
            .addCase(searchProducts.pending, (state) => {
                state.search.loading = true;
                state.search.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.search.loading = false;
                state.search.searchResults = action.payload;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.search.loading = false;
                state.search.error = action.payload;
            })
            // Search products by category
            .addCase(searchProductsByCategory.pending, (state) => {
                state.categoryProduct.loading = true;
                state.categoryProduct.error = null;
            })
            .addCase(searchProductsByCategory.fulfilled, (state, action) => {
                state.categoryProduct.loading = false;

                const categoryKey = action.meta.arg
                    .toLowerCase()
                    .replace(/ /g, '_');
                state.categoryProduct[categoryKey] = action.payload;
            })
            .addCase(searchProductsByCategory.rejected, (state, action) => {
                state.categoryProduct.loading = false;
                state.categoryProduct.error = action.payload;
            });
    },
});

export const { productOneWislistToggle } = productSlice.actions;
export const { actions } = productSlice;
export default productSlice.reducer;
