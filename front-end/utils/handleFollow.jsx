import axios from "axios";

export const handleFollowAndUnfollow = async (
  targetUserID,
  user,
  userProfile,
  dispatch,
  setAuthUser,
  setUserProfile
) => {
  console.log("userID", targetUserID);

  try {
    await axios.post(
      `http://localhost:8000/api/users/follow/${targetUserID}`,
      {},
      {
        withCredentials: true,
      }
    );

    let updatedUser;
    let updatedUserProfile;

    if (user.following.includes(targetUserID)) {
      updatedUser = {
        ...user,
        following: user.following.filter((elem) => elem !== targetUserID),
      };

      updatedUserProfile = userProfile && {
        ...userProfile,
        followers: userProfile.followers.filter((elem) => elem !== user._id),
      };
    } else {
      updatedUser = {
        ...user,
        following: [...user.following, targetUserID],
      };

      updatedUserProfile = userProfile && {
        ...userProfile,
        followers: [...userProfile.followers, user._id],
      };
    }

    console.log("updated user", updatedUser);
    console.log("updated user profile: ", updatedUserProfile);

    dispatch(setAuthUser(updatedUser));
    userProfile && dispatch(setUserProfile(updatedUserProfile));
    console.log(userProfile);
  } catch (error) {
    if (error.response) {
      console.error(error.response.data.msg);
    } else {
      console.error(error.message);
    }
  }
};
