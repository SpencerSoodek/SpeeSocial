import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    followRequests: [],
    isLoading: false,
    isError: false
}

export const getFollowRequests = createAsyncThunk('followRequests/getFollowRequests', async (thunkAPI) => {
    try {
        const response = await axios.get('/api/followRequests', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const acceptRequest = createAsyncThunk('followRequests/approveRequest', async (requestId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/followRequests/accept/${requestId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const declineRequest = createAsyncThunk('followRequests/rejectRequest', async (requestId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/followRequests/decline/${requestId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});


const followRequestsSlice = createSlice({
    name: "followRequests",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFollowRequests.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFollowRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.followRequests = action.payload;
            console.log(action.payload);
        })
        .addCase(getFollowRequests.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        .addCase(acceptRequest.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(acceptRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.followRequests = state.followRequests.filter(request => request.sender._id !== action.payload);
        })
        .addCase(acceptRequest.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        .addCase(declineRequest.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(declineRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.followRequests = state.followRequests.filter(request => request.sender._id !== action.payload)
        })
        .addCase(declineRequest.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
    }       
});

export default followRequestsSlice.reducer;