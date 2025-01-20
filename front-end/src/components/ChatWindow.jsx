import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedUser } from "../redux/userSlice";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";
import useGetAllMessages from "../hooks/useGetAllMessages";
import sueGetRealTimeMessages from "../hooks/useGetRealTimeMessages";

export default function ChatWindow() {
  useGetAllMessages();
  sueGetRealTimeMessages();
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);

  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const [disabledSendBtn, setDisabledSendBtn] = useState(true);

  useEffect(() => {
    const messageContainer = document.getElementById("chat-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const inputHandler = (e) => {
    setText(e.target.value);
    if (e.target.value !== "") {
      setDisabledSendBtn(false);
    } else {
      setDisabledSendBtn(false);
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    console.log(selectedUser._id);

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/messages/send/${selectedUser._id}`,
        { text },
        {
          withCredentials: true,
        }
      );

      dispatch(setMessages([...messages, data.newMessage]));

      setText("");
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.msg);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  const handleLeftBtn = () => {
    dispatch(setSelectedUser(null));
  };

  return (
    <>
      <div className="chat-window">
        {selectedUser ? (
          <div style={{ height: "100%" }}>
            <div className="header">
              <i
                onClick={handleLeftBtn}
                className="ri-arrow-left-long-fill leftBtn"
              ></i>
              <Link className="my-profile d-flex gap-2 align-items-center">
                <img src={selectedUser.profilePicture} alt="" />
                <div>
                  <span className="my-profile-username">
                    {selectedUser.username}
                  </span>
                  <span className="name d-block ">{selectedUser.fullname}</span>
                </div>
              </Link>
            </div>

            <div className="chat-container" id="chat-container">
              <div>
                <div className="user-profile text-center d-flex justify-content-center">
                  <div>
                    <img src={selectedUser.profilePicture} alt="" />
                    <h4>{selectedUser.fullname}</h4>
                    <span className="d-block">
                      {selectedUser.username} · Instagram
                    </span>
                    <Link
                      to={`/profile/${selectedUser._id}`}
                      className="viewBtn d-inline-block mt-3"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
              <ul>
                {messages?.map((elem, i) => (
                  <li
                    className={
                      elem.senderID == user._id
                        ? "sendMessage"
                        : "receiveMessage"
                    }
                    key={i}
                  >
                    <span className="d-inline-block">{elem.content}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={sendMessageHandler}>
              <div>
                <button type="button" className="emogiBtn">
                  <i className="ri-emotion-happy-line"></i>
                </button>
                <input
                  value={text}
                  onChange={inputHandler}
                  placeholder="Message..."
                  type="text"
                  className="enteredMessage"
                />
                <button
                  className="sendbtn"
                  type="submit"
                  disabled={disabledSendBtn}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="messageToStartChat">
            <div className="text-center">
              <i className="ri-chat-history-line"></i>
              <p>Your messages</p>
              <span>Send a message to start a chat.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
