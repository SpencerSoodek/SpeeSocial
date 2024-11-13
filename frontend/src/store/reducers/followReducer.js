import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    followingUsers: {}, // Use an object instead of a Map
    blockedUsers: [],
    isLoading: false,
    isError: false,
};

export const followingUser = createAsyncThunk('followReducer/followingUser', async (userId, thunkAPI) => {
    try {
        const response = await axios.get(`/api/users/following/${userId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return { userId, followingStatus: response.data.followingStatus };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const followUser = createAsyncThunk('followReducer/followUser', async (userId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/users/follow/${userId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return { userId, followStatus: response.data.followStatus };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const unfollowUser = createAsyncThunk('followReducer/unfollowUser', async (userId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/users/unfollow/${userId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return {userId, response};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const blockUser = createAsyncThunk('followReducer/blockUser', async (userId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/users/block/${userId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return {userId};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const unblockUser = createAsyncThunk('followReducer/unblockUser', async (userId, thunkAPI) => {
    try {
        const response = await axios.post(`/api/users/unblock/${userId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return {userId};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

export const getBlockedUsers = createAsyncThunk('followReducer/blockedUsers', async (thunkAPI) => {
    try {
        const response = await axios.get('/api/users/blockedUsers', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.errors);
    }
});

const followingSlice = createSlice({
    name: "following",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(followingUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(followingUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { userId, followingStatus } = action.payload;
                state.followingUsers[userId] = { followingStatus }; // Set the status for the specific userId
            })
            .addCase(followingUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })
            .addCase(followUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { userId, followStatus } = action.payload;
                state.followingUsers[userId] = { followStatus };
                console.log(state.followingUsers); // Set the status for the specific userId
            })
            .addCase(followUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { userId } = action.payload;
                state.followingUsers[userId] =  "not following" 
            })
            .addCase(unfollowUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })
            .addCase(blockUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { userId } = action.payload;
                state.followingUsers[userId] =  "blocked" 
            })
            .addCase(blockUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })
            .addCase(getBlockedUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.blockedUsers = action.payload;
            })
            .addCase(getBlockedUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlockedUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { userId } = action.payload;
                state.followingUsers[userId] =  "not following"
                state.blockedUsers = state.blockedUsers.filter(user => user._id !== userId);
            })
            .addCase(unblockUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(unblockUser.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
    })
    }
});

export default followingSlice.reducer;
