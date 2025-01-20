import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "../redux/postSlice";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  const fetchAllPosts = async () => {
    const { data } = await axios.get("http://localhost:8000/api/posts/all", {
      withCredentials: true,
    });

    dispatch(setPosts(data.posts));
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);
};

export default useGetAllPosts;
