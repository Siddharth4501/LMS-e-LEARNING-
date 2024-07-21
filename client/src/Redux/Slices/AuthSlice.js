import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";


const initialState={
    isLoggedIn:localStorage.getItem('isLoggedIn') || false,
    role:localStorage.getItem('role') || '',
    data:localStorage.getItem('data') || {}
}
// there is no need to make a reducer for the signup action because we dont neet to store anything in store ,we simply pefomt async operation so thunk is enough for it
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
      let res = axiosInstance.post("user/register", data);
      toast.promise(res, {
        loading: "Wait! Creating your account",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to create account",
      });
  
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  });

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{},

});

//named export
//export const {}=authSlice.actions;

//default export
export default authSlice.reducer;