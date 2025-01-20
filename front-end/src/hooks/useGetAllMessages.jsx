import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

export default function useGetAllMessages() {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchAllMessages = async () => {
    try {
      const { data } = await axios.get(
        `https://arman-instagram.onrender.com/api/messages/fetch/${selectedUser?._id}`,
        {
          withCredentials: true,
        }
      );

      dispatch(setMessages(data.messages));
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchAllMessages();
    }
  }, [selectedUser]);
}
