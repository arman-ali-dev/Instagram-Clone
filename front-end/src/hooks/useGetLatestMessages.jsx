import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLatestMessages } from "../redux/chatSlice";

export default function useGetLatestMessages() {
  const dispatch = useDispatch();
  const fetchLatestMessages = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/messages/latest",
        {
          withCredentials: true,
        }
      );

      dispatch(setLatestMessages(data.latestMessages));
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    console.log("fetchLatestMessages chal gaya ");

    fetchLatestMessages();
  }, []);
}
