import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice.js'
import CoursesReducer from './Slices/CourseSlice.js'
import razorpaySliceReducer from './Slices/RazorpaySlice.js'
import lectureSliceReducer from './Slices/LectureSlice.js'
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        course:CoursesReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        // stat: statSliceReducer,
    },
    devtools:true
});

export default store;