 import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
 import axios from "axios";

 const initialState = {
    currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : undefined,
    isLoading: false
 };

 export const signup = createAsyncThunk('auth/signup', async(userData, thunkAPI) => {
   try{
      const response = await axios.post('/api/auth/signup', {
         username: userData.username,
         email: userData.email,
         password: userData.password,
         privateAccount: userData.privateAccount
      });

      const user = response.data;
      localStorage.setItem('currentUser', JSON.stringify(user));

      return user;
   }
   catch(error) {
      return thunkAPI.rejectWithValue(error.response.data.errors);
   }
 }
);

export const login = createAsyncThunk('auth/login', async(userData, thunkAPI) => {
   try{
      const response = await axios.post('/api/auth/login', {
         username: userData.username,
         email: userData.email,
         password: userData.password,
      },
      {
         headers: { 'Content-Type': 'application/json' },
         withCredentials: true
      }
      );

      const user = response.data;
      console.log(response);
      console.log(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return response.data;
   }
   catch(error) {
      return thunkAPI.rejectWithValue(error.response.data.errors);
   }
 }
);

export const logout = createAsyncThunk('auth/logout', async(thunkAPI) => {
   try{
      const response = await axios.post('/api/auth/logout');
      localStorage.removeItem('currentUser');
      console.log("response" + response.message);
      return response.data;
   }
   catch(error) {
      console.log("error" + error);
      return thunkAPI.rejectWithValue(error.response.data.errors);
   }
})

 const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: builder => {
      builder.addCase(signup.pending, (state) => {
         state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
         state.isLoading = false;
         state.currentUser = action.payload;
      })
      .addCase(signup.rejected, (state) => {
         state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
         state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
         state.isLoading = false;
         state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
         state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
         state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
         state.isLoading = false;
         state.currentUser = undefined;
      })
      .addCase(logout.rejected, (state) => {
         state.isLoading = false;
      })
    }
 });

 export default authSlice.reducer;