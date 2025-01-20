import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/chatSlice";
import { useEffect } from "react";

export default function sueGetRealTimeMessages() {
  const { socket } = useSelector((state) => state.socket);
  const { messages } = useSelector((state) => state.chat);
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (message.senderID == selectedUser?._id) {
        dispatch(setMessages([...messages, message]));
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [messages]);
}
