import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    notifications: [],
    unReadCount: 0,
  },
  reducers: {
    setNotification: (state, action) => {
      if (
        action.payload.type === "like" ||
        action.payload.type === "comment" ||
        action.payload.type === "follow"
      ) {
        state.notifications.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.notifications = state.notifications.filter(
          (elem) =>
            elem.postID != action.payload.postID ||
            elem.userID != action.payload.userID
        );
      } else if (action.payload.type === "unfollow") {
        state.notifications = state.notifications.filter(
          (elem) =>
            elem.userID !== action.payload.userID ||
            elem.targetUserID !== action.payload.targetUserID
        );
      }
    },

    resetUnReadCount: (state) => {
      state.unReadCount = 0;
    },
    updateUnReadCount: (state) => {
      state.unReadCount += 1;
    },
  },
});

export const { setNotification, updateUnReadCount, resetUnReadCount } =
  rtnSlice.actions;
export default rtnSlice.reducer;
