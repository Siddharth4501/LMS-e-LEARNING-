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


// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/login", data);

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log in",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error.message);
  }
});

// function to handle logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.post("/user/logout");

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error.message);
  }
});

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
      builder
        // for user login
        .addCase(login.fulfilled, (state, action) => {
          localStorage.setItem("data", JSON.stringify(action?.payload?.user));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", action?.payload?.user?.role);
          state.isLoggedIn = true;
          state.data = action?.payload?.user;
          state.role = action?.payload?.user?.role;
        })
        // for user logout
        .addCase(logout.fulfilled, (state) => {
          localStorage.clear();
          state.isLoggedIn = false;
          state.data = {};
        })

      }});

//named export
//export const {}=authSlice.actions;

//default export
export default authSlice.reducer;