import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/postSlice";
import { toast } from "react-toastify";
import { setAuthUser } from "../redux/authSlice";
import { setUserProfile } from "../redux/userSlice";
import { handleFollowAndUnfollow } from "../../utils/handleFollow";

export default function FollowAndDeletePopUp({
  setShowFollowAndDeletePopUp,
  postID,
  postAuthorID,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const { userProfile } = useSelector((state) => state.user);

  const handleDeletePost = async () => {
    try {
      await axios.delete(
        `https://arman-instagram.onrender.com/api/posts/delete/${postID}`,
        {
          withCredentials: true,
        }
      );

      const filteredPosts = posts.filter((elem) => elem._id !== postID);

      dispatch(setPosts(filteredPosts));
      dispatch(
        setAuthUser({
          ...user,
          posts: user.posts.filter((elem) => elem !== postID),
        })
      );

      userProfile &&
        dispatch(
          setUserProfile({
            ...userProfile,
            posts: userProfile.posts.filter((elem) => elem !== postID),
          })
        );
      setShowFollowAndDeletePopUp(false);

      return toast.success("post deleted!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
  return (
    <>
      <div className="back-view">
        <div className="unfollow-popup">
          <ul>
            <li>
              {user.posts.includes(postID) ? (
                <button onClick={handleDeletePost} className="delete-text">
                  Delete
                </button>
              ) : user.following.includes(postAuthorID) ? (
                <button
                  onClick={() => {
                    handleFollowAndUnfollow(
                      postAuthorID,
                      user,
                      userProfile,
                      dispatch,
                      setAuthUser,
                      setUserProfile
                    );
                    setShowFollowAndDeletePopUp(false);
                  }}
                  className="unfollow-text"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFollowAndUnfollow(
                      postAuthorID,
                      user,
                      userProfile,
                      dispatch,
                      setAuthUser,
                      setUserProfile
                    );
                    setShowFollowAndDeletePopUp(false);
                  }}
                  className="follow-text"
                >
                  Follow
                </button>
              )}
            </li>
            <li>
              <button onClick={() => setShowFollowAndDeletePopUp(false)}>
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
