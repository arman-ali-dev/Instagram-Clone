import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    latestMessages: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addLatestMessage: (state, action) => {
      state.latestMessages.push(action.payload);
    },
    setLatestMessages: (state, action) => {
      state.latestMessages = action.payload;
    },
  },
});

export default chatSlice.reducer;
export const {
  setOnlineUsers,
  addLatestMessage,
  setMessages,
  setLatestMessages,
} = chatSlice.actions;
