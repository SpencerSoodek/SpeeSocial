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
    posts: [],
    followers: [],
    usersFollowing: []
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

export const getFollowers = createAsyncThunk('profile/getFollowers', async(userId, thunkAPI) => {
    try{
        const response = await axios.get(('/api/users/followers/' + userId), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const getFollowing = createAsyncThunk('profile/getFollowing', async(userId, thunkAPI) => {
    try{
        const response = await axios.get(('/api/users/followingUsers/' + userId), {
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
        unfollowed: (state) => {
            state.following = false;
            state.posts = [];
        }
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
        .addCase(getFollowers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFollowers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.followers = action.payload;
        })
        .addCase(getFollowers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
        .addCase(getFollowing.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFollowing.fulfilled, (state, action) => {
            state.isLoading = false;
            state.usersFollowing = action.payload;
        })
        .addCase(getFollowing.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
    }
});

export default profileSlice.reducer;
export const { unfollowed } = profileSlice.actions;