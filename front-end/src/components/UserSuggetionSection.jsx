import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleFollowAndUnfollow } from "../../utils/handleFollow";
import { setUserProfile } from "../redux/userSlice";
import { setAuthUser } from "../redux/authSlice";

export default function UserSuggetionSection() {
  const { user } = useSelector((state) => state.auth);
  const { suggestedUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <>
      <div className="user-suggetion-section">
        <div className="d-flex justify-content-between align-items-center">
          <div className="my-profile d-flex gap-3 align-items-center">
            <img src={user?.profilePicture} alt="" />
            <div>
              <span className="my-profile-username">{user?.username}</span>
              <span className="name d-block ">{user?.fullname}</span>
            </div>
          </div>

          <div>
            <button className="switchBtn">Switch</button>
          </div>
        </div>

        <div className="suggestions mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 suggestion-text">Suggest for you</p>
            <Link to="suggested" className="seeAllBtn">
              See All
            </Link>
          </div>

          {suggestedUsers
            ?.filter((elem) => !user.following.includes(elem._id))
            .slice(0, 5)
            .map((elem) => {
              return (
                <div
                  key={elem._id}
                  className="d-flex justify-content-between align-items-center mt-3"
                >
                  <Link
                    to={`/profile/${elem._id}`}
                    className="user-profile d-flex gap-3 align-items-center"
                  >
                    <img src={elem.profilePicture} alt="" />
                    <div>
                      <span className="user-profile-username">
                        {elem.username}
                      </span>
                      <span className="name d-block ">{elem.fullname}</span>
                    </div>
                  </Link>

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
                      className="switchBtn"
                      type="button"
                    >
                      follow
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="service-text ">
          <p>
            About • Help • Press • API • Jobs • Privacy • Terms • Locations •
            Language • Meta Verified
            <br />
            <br />© 2025 Instagram from Meta
          </p>
        </div>
      </div>
    </>
  );
}
