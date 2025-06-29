import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./reducers/auth";
import api from "./api/api";
import projectSlice from "./reducers/project";
import adminApi from "./api/adminApi";


const store=configureStore({
    reducer:{
        [AuthSlice.name]:AuthSlice.reducer,
        [projectSlice.name]:projectSlice.reducer,
        [api.reducerPath]:api.reducer,
        [adminApi.reducerPath]:adminApi.reducer
    },
    middleware:(mid)=>mid().concat(api.middleware,adminApi.middleware),
})

export default store;