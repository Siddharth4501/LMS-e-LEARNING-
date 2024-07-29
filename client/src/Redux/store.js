import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice.js'
import CoursesReducer from './Slices/CourseSlice.js'
import razorpaySliceReducer from './Slices/RazorpaySlice.js'
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        course:CoursesReducer,
        razorpay: razorpaySliceReducer,
    },
    devtools:true
});

export default store;