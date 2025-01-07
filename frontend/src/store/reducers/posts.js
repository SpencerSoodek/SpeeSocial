import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {addReply} from './postPageReducer'

const initialState = {
    posts: [],
    isLoading: false,
    isError: false,
    error: ''
};

export const getAllPosts = createAsyncThunk('posts/getPosts', async(thunkAPI) => {
    try{
        const response = await axios.get('/api/posts', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
        })
        
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const getFollowingPosts = createAsyncThunk('posts/getFollowingPosts', async(thunkAPI) => {
    try {
        const response = await axios.get('/api/posts/following', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
        })
        
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const createPost = createAsyncThunk('posts/createPost', async(postData, thunkAPI) => {

    try {
        const response = await axios.post('/api/posts/create', {
                text: postData.postText}, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
        })
        
        return response.data;
    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const createReply = createAsyncThunk('posts/createReply', async(postData, thunkAPI) => {
    try {
        const response = await axios.post(('/api/posts/reply/' + postData.parentPost._id), {
                text: postData.replyText}, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
        })
        console.log("new reply, ", response.data);
        thunkAPI.dispatch(addReply(response.data));
        
        return response.data;
    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async(postId, thunkAPI) => {
    try {
        const response = await axios.delete(('/api/posts/delete/' + postId), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
        })
        
        return response.data;
    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

const postsSlice = createSlice({
    name: "posts",
    initialState,
    extraReducers: builder => {
        builder.addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message
        })
        .addCase(getFollowingPosts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFollowingPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        })
        .addCase(getFollowingPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message
        })
        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts.unshift(action.payload);
        })  
        .addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message
        })
        .addCase(createReply.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createReply.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(createReply.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
        .addCase(deletePost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = state.posts.filter(post => post._id !== action.payload);
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.error.message;
        })
    }
});

export default postsSlice.reducer;