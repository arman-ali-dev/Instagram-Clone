import { createSlice } from "@reduxjs/toolkit";

const suggestedUsersSlice = createSlice({
  name: "user",
  initialState: {
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export default suggestedUsersSlice.reducer;
export const { setSuggestedUsers, setUserProfile, setSelectedUser } =
  suggestedUsersSlice.actions;
