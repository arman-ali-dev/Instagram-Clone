import axios from "axios";

export const handleLike = async (id, posts, user, dispatch, updatePosts) => {
  try {
    await axios.post(
      `https://arman-instagram.onrender.com/api/posts/like/${id}`,
      {},
      {
        withCredentials: true,
      }
    );

    const updatedPosts = posts.map((post) => {
      console.log(post.likes.includes(user._id));
      return post._id === id
        ? {
            ...post,
            likes: post.likes.includes(user._id)
              ? post.likes.filter((elem) => elem !== user._id)
              : [...post.likes, user._id],
          }
        : post;
    });

    dispatch(updatePosts(updatedPosts));
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.msg);
    } else {
      console.log(error.message);
    }
  }
};
