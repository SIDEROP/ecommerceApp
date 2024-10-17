import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import dashboardReducer from "./slices/dashboardSlice";
import ratingdReducer from "./slices/ratingSlice";
import wishlistReducer from "./slices/wishlistSlice";
import addressReducer from "./slices/addressSlice";

export const Store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart:cartReducer,
        order:orderReducer,
        dashboard:dashboardReducer,
        rating:ratingdReducer,
        wishlist:wishlistReducer,
        address:addressReducer
    },
});
