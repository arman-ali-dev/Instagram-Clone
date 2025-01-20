import { useEffect, useState } from "react";
import UploadProfilePhotoPopUp from "../components/UploadProfilePhotoPopUp";
import { Link, useParams } from "react-router-dom";
import UserPost from "../components/UserPost";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { setUserProfile } from "../redux/userSlice";
import UserBookMarkedPost from "../components/UserBookmarkedPost";
import { handleFollowAndUnfollow } from "../../utils/handleFollow";

export default function Profile() {
  const params = useParams();
  const userID = params.id;
  useGetUserProfile(userID);

  const { userProfile } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const [showChangeProfilePhotoPopUp, setShowChangeProfilePhotoPopUp] =
    useState(false);

  const [activeTab, setActiveTab] = useState("posts");

  const handleChangeActiveTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      dispatch(setUserProfile(null));
    };
  }, []);

  return (
    <>
      <div className=" profile-section d-flex justify-content-center">
        <div>
          <div className="profle-details align-items-center d-flex ">
            <img
              src={userProfile?.profilePicture}
              alt=""
              className="user-picture"
              onClick={() => setShowChangeProfilePhotoPopUp(true)}
            />

            <div>
              <div className="d-flex align-items-center gap-4 ">
                <h2 className="profile-username mb-0">
                  {userProfile?.username}
                </h2>
                {user?._id === userID ? (
                  <Link to="/edit-profile" className="editBtn">
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    {user?.following.includes(userProfile?._id) ? (
                      <>
                        <button
                          onClick={() =>
                            handleFollowAndUnfollow(
                              userProfile?._id,
                              user,
                              userProfile,
                              dispatch,
                              setAuthUser,
                              setUserProfile
                            )
                          }
                          className={` px-4 unfollowBtn`}
                        >
                          Unfollow
                        </button>
                        <button className="messageBtn px-4">Message</button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          handleFollowAndUnfollow(
                            userProfile?._id,
                            user,
                            userProfile,
                            dispatch,
                            setAuthUser,
                            setUserProfile
                          )
                        }
                        className={`followBtn px-4`}
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="d-flex align-items-center  gap-4 lg:gap-5 mt-3">
                <p className="postNumber">{userProfile?.posts.length} posts</p>
                <p className="followersNumber">
                  {userProfile?.followers.length} followers
                </p>
                <p className="followingNumber">
                  {userProfile?.following.length} following
                </p>
              </div>

              <div>
                <h3 className="profile-name">{userProfile?.fullname}</h3>
              </div>

              {userProfile?.bio.length !== 0 && (
                <div className="bio">{userProfile?.bio}</div>
              )}
            </div>
          </div>

          <div className="userMedia">
            <ul className="d-flex justify-content-center">
              <li className="py-2">
                <span
                  onClick={() => handleChangeActiveTab("posts")}
                  className={activeTab === "posts" ? "active" : ""}
                >
                  <i className="ri-layout-grid-2-line"></i> POSTS
                </span>
              </li>
              <li className="py-2">
                <span
                  onClick={() => handleChangeActiveTab("saved")}
                  className={activeTab === "saved" ? "active" : ""}
                >
                  <i
                    className={`ri-bookmark-${
                      activeTab === "saved" ? "fill" : "line"
                    }`}
                  ></i>{" "}
                  SAVED
                </span>
              </li>
            </ul>
          </div>

          {activeTab === "posts" ? (
            <div className="user-posts mt-2">
              {posts?.length !== 0 &&
                posts.map((post) => {
                  return post?.authorID?._id === userProfile?._id ? (
                    <UserPost
                      postAuthorID={post?.authorID?._id}
                      key={post?._id}
                      id={post?._id}
                      image={post?.image}
                      caption={post?.caption}
                      like={post?.likes}
                      comments={post?.comments}
                      profilePicture={post?.authorID?.profilePicture}
                      username={post?.authorID?.username}
                    />
                  ) : (
                    ""
                  );
                })}
            </div>
          ) : (
            <div className="user-bookmarked-posts mt-2">
              {posts
                ?.slice()
                .reverse()
                .map((post) => {
                  return user?.bookmarks.includes(post._id) ? (
                    <>
                      <UserBookMarkedPost
                        postAuthorID={post.authorID._id}
                        key={post._id}
                        id={post._id}
                        image={post.image}
                        caption={post.caption}
                        like={post.likes}
                        comments={post.comments}
                        profilePicture={post.authorID.profilePicture}
                        username={post.authorID.username}
                      />
                    </>
                  ) : null;
                })}
            </div>
          )}
        </div>
      </div>

      {showChangeProfilePhotoPopUp && (
        <UploadProfilePhotoPopUp
          setShowChangeProfilePhotoPopUp={setShowChangeProfilePhotoPopUp}
        />
      )}
    </>
  );
}
