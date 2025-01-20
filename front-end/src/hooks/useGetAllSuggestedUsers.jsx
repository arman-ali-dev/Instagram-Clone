import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/userSlice";

export default function useGetAllSuggestedUsers() {
  const dispatch = useDispatch();
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "https://arman-instagram.onrender.com/api/users/suggested-users",
        {
          withCredentials: true,
        }
      );

      dispatch(setSuggestedUsers(data.users));
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
}
