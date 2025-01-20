import { useDispatch, useSelector } from "react-redux";
import { handleFollowAndUnfollow } from "../../utils/handleFollow";
import { setAuthUser } from "../redux/authSlice";

export default function NotificationItem({
  profilePicture,
  type,
  username,
  text,
  postImage,
  userID,
}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      {type === "like" && (
        <>
          <div className="my-profile Notification-hover  justify-content-between  d-flex gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src={profilePicture} alt="" />
              <div className="d-flex ">
                <span className="my-profile-username ">{username}</span>
                <p className="notification-type">liked your post</p>
              </div>
            </div>
            <img className="likedPost" src={postImage} alt="" />
          </div>
        </>
      )}

      {type === "comment" && (
        <>
          <div className="my-profile Notification-hover  justify-content-between  d-flex gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src={profilePicture} alt="" />
              <div className="d-flex ">
                <span className="my-profile-username ">{username}</span>
                <span className="notification-type">commented: {text}</span>
              </div>
            </div>
            <img className="likedPost" src={postImage} alt="" />
          </div>
        </>
      )}

      {type === "follow" && (
        <>
          <div className="my-profile Notification-hover  justify-content-between  d-flex gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2 profile-image-main">
              <img src={profilePicture} alt="" />
              <div className="follow-user-main">
                <span className="my-profile-username ">{username}</span>
                <span className="notification-type">started following you</span>
              </div>
            </div>
            {user?.following.includes(userID) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowAndUnfollow(
                    userID,
                    user,
                    null,
                    dispatch,
                    setAuthUser,
                    null
                  );
                }}
                type="button"
                className="unfollowBtn"
              >
                unfollow
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowAndUnfollow(
                    userID,
                    user,
                    null,
                    dispatch,
                    setAuthUser,
                    null
                  );
                }}
                type="button"
                className="followBtn"
              >
                follow back
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
