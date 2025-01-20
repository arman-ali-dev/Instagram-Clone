import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/userSlice";

export default function useGetUserProfile(userID) {
  const dispatch = useDispatch();
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/users/profile/${userID}`,
        {
          withCredentials: true,
        }
      );

      dispatch(setUserProfile(data.user));
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.msg);
      } else {
        console.error(error.msg);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userID]);
}
