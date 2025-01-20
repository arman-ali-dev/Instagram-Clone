import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setLatestMessages } from "../redux/chatSlice";
import axios from "axios";

export default function UserWindow() {
  const { user } = useSelector((state) => state.auth);
  const { suggestedUsers, selectedUser } = useSelector((state) => state.user);
  const { latestMessages } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDropLatestMessages = async (id) => {
    console.log(id);

    try {
      await axios.delete(`http://localhost:8000/api/messages/drop/${id}`, {
        withCredentials: true,
      });

      const filteredMessages = latestMessages.filter(
        (elem) => elem.senderID !== id || elem.receiverID !== user._id
      );

      dispatch(setLatestMessages(filteredMessages));
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.warn(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <>
      <div
        className={`user-window-main ${
          selectedUser ? "responsive-userWindow" : ""
        }`}
      >
        <div className="user-window">
          <div>
            <i
              onClick={() => navigate("/")}
              className="ri-arrow-left-s-line leftBtn"
            ></i>
            <h4 className="username ">{user?.username}</h4>
          </div>

          <div className="user-section">
            <h4>Messages</h4>
            {suggestedUsers?.map((elem) => (
              <div
                key={elem._id}
                onClick={() => {
                  dispatch(setSelectedUser(elem));
                  handleDropLatestMessages(elem._id);
                }}
                className="profile-hover d-flex justify-content-between align-items-center"
              >
                <div className="my-profile    d-flex gap-2 align-items-center">
                  <div className="profile-picture-main">
                    <img src={elem.profilePicture} alt="" />
                    {onlineUsers?.includes(elem._id) && (
                      <span className="user-status"></span>
                    )}
                  </div>
                  <div>
                    <span className="my-profile-username">{elem.username}</span>
                    <span className="name d-block ">{elem.fullname}</span>
                  </div>
                </div>

                {latestMessages?.filter((msg) => msg.senderID === elem._id)
                  .length !== 0 && <div className="latestMessage-dot"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
