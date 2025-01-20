import axios from "axios";

export const commentHandler = async (
  id,
  content,
  posts,
  dispatch,
  setContent,
  setShowPostBtn,
  setPosts
) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/api/posts/comment/${id}`,
      { text: content },
      {
        withCredentials: true,
      }
    );

    const updatedPosts = posts.map((post) =>
      post._id === id
        ? { ...post, comments: [data.comment, ...post.comments] }
        : post
    );

    dispatch(setPosts(updatedPosts));
    setContent("");
    setShowPostBtn(false);
  } catch (error) {
    if (error.response) {
      return toast.error(error.response.data.msg, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      console.error(error.message);
    }
  }
};
