import { useEffect, useState } from "react";
import Asidebar from "./components/Asidebar";
import Chat from "./pages/Chat";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import SuggestedUsers from "./pages/SuggestedUsers";
import { Routes, Route, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { addLatestMessage, setOnlineUsers } from "./redux/chatSlice";
import { setNotification, updateUnReadCount } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Search from "./pages/Search";
import Notification from "./pages/Notification";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    let socket;
    if (user) {
      socket = io("http://localhost:8000", {
        query: {
          userID: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on("notification", (notification) => {
        console.log("new notification:", notification);

        dispatch(setNotification(notification));

        if (
          notification.type === "like" ||
          notification.type === "comment" ||
          notification.type === "follow"
        )
          dispatch(updateUnReadCount());
      });

      socket.on("latestMessage", (message) => {
        if (!selectedUser || selectedUser._id !== message.senderID) {
          dispatch(addLatestMessage(message));
        }
      });
    }

    return () => {
      if (socket) {
        dispatch(setSocket(null));
        socket.close();
      }
    };
  }, [user, dispatch, selectedUser]);

  const location = useLocation();
  const hideAsidebarAndNavBarRoutes = [
    "/login",
    "/signup",
    "/chat",
    "/search",
    "/notifications",
  ];

  return (
    <>
      <div
        className={`${
          hideAsidebarAndNavBarRoutes.includes(location.pathname)
            ? "d-block"
            : "d-flex"
        } root-main `}
      >
        {!hideAsidebarAndNavBarRoutes.includes(location.pathname) && (
          <Asidebar />
        )}

        {!hideAsidebarAndNavBarRoutes.includes(location.pathname) && <NavBar />}

        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
            path="/profile/:id"
          />
          <Route
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
            path="edit-profile"
          />
          <Route
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
            path="/chat"
          />

          <Route
            element={
              <ProtectedRoute>
                <SuggestedUsers />
              </ProtectedRoute>
            }
            path="/suggested"
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="/notifications" element={<Notification />}></Route>
        </Routes>
        {!hideAsidebarAndNavBarRoutes.includes(location.pathname) && (
          <BottomNavBar />
        )}
      </div>
    </>
  );
};

export default App;
