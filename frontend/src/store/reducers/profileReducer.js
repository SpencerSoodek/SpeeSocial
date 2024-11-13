import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    blocked: false,
    private: false,
    profile: undefined,
    isLoading: false,
    isError: false,
    myAccount: false,
    following: false,
    error: '',
    posts: []
};

export const getProfile = createAsyncThunk('profile/getProfile', async(username, thunkAPI) => {
    try{
        const response = await axios.get(('/api/users/profile/' + username), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const getProfilePosts = createAsyncThunk('posts/profile/', async(id, thunkAPI) => {
    try{
        console.log(id);
        const response = await axios.get(('/api/posts/profile/' + id), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
        .addCase(getProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            if (localStorage.getItem)
            state.following = action.payload.following;
            state.profile = action.payload.profile;
            state.private = action.payload.privateAccount;
            state.blocked = action.payload.blocked;
        })
        .addCase(getProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
        .addCase(getProfilePosts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getProfilePosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        })
        .addCase(getProfilePosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
    }
});

export default profileSlice.reducer;