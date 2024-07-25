import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice.js'
import CoursesReducer from './Slices/CourseSlice.js'
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        course:CoursesReducer
    },
    devtools:true
});

export default store;