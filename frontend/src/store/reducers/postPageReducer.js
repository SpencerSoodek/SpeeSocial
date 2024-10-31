import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    post: undefined,
    parent: {},
    isLoading: false,
    isError: false,
}

export const getPost = createAsyncThunk('postPageReducer/getPost', async(postId, thunkAPI) => {
    console.log("getPost", postId);
    try{
        const response = await axios.get(('/api/posts/getpost/' + postId), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        console.log("response",response.data)
        return response.data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
})

const postPageSlice = createSlice({
    name: "postPage",
    initialState,
    extraReducers: builder => {
        builder.addCase(getPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getPost.fulfilled, (state, action) => {
            console.log(state.post);
            state.isLoading = false;
            state.post = action.payload;
        })
        .addCase(getPost.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            console.log("error");
        })
    }
});

export default postPageSlice.reducer;