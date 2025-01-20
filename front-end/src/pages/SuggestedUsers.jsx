import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { setUserProfile } from "../redux/userSlice";
import { handleFollowAndUnfollow } from "../../utils/handleFollow";

export default function SuggestedUsers() {
  const { suggestedUsers } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <>
      <div className="suggetedUsers-main">
        <h5 className="mb-4">Suggested</h5>

        {suggestedUsers
          ?.filter((elem) => !user.following.includes(elem._id))
          .map((elem) => (
            <div
              key={elem._id}
              className="d-flex justify-content-between align-items-center mt-3"
            >
              <div className="user-profile d-flex gap-2 align-items-center">
                <img src={elem.profilePicture} alt="" />
                <div>
                  <span className="user-profile-username">{elem.username}</span>
                  <span className="name d-block ">{elem.fullname}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() =>
                    handleFollowAndUnfollow(
                      elem?._id,
                      user,
                      null,
                      dispatch,
                      setAuthUser,
                      setUserProfile
                    )
                  }
                  className="followBtn"
                >
                  follow
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
