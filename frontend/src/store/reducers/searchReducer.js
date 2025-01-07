import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    isLoading: false,
    isError: false,
    error: ''
};

export const searchUsers = createAsyncThunk('search/searchUsers', async(searchTerm, thunkAPI) => {
    try{
        const response = await axios.get(('/api/users/search/' + searchTerm), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(searchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
            console.log(action.payload);
        })
        .addCase(searchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
    }
})

export default searchSlice.reducer;