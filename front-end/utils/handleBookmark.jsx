import axios from "axios";

export const handleBookmark = async (id, user, dispatch, setAuthUser) => {
  try {
    await axios.post(
      `http://localhost:8000/api/posts/bookmark/${id}`,
      {},
      {
        withCredentials: true,
      }
    );

    const updatedAuthUser = user.bookmarks.includes(id)
      ? { ...user, bookmarks: user.bookmarks.filter((elem) => elem != id) }
      : { ...user, bookmarks: [id, ...user.bookmarks] };
    dispatch(setAuthUser(updatedAuthUser));
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.msg);
    } else {
      console.error(error.message);
    }
  }
};
