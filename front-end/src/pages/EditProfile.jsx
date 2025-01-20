import { useState } from "react";
import UploadProfilePhotoPopUp from "../components/UploadProfilePhotoPopUp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuthUser } from "../redux/authSlice";

export default function EditProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showChangeProfilePhotoPopUp, setShowChangeProfilePhotoPopUp] =
    useState(false);

  const [fullname, setFullname] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const [gender, setGender] = useState("male");
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [removeCurrentProfilePicture, setRemoveCurrentProfilePicture] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const selectHanlder = (e) => {
    setGender(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("djfh");

    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("gender", gender);
      formData.append("bio", bio);
      formData.append("profilePicture", profilePicture);
      formData.append("removeProfilePicture", removeCurrentProfilePicture);
      console.log("removeCurrentProfilePicture", removeCurrentProfilePicture);

      const { data } = await axios.patch(
        "https://arman-instagram.onrender.com/api/users/edit-profile",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(data.user);
      dispatch(setAuthUser(data.user));
      setProfilePicturePreview("");
      setProfilePicture("");
      setRemoveCurrentProfilePicture(false);
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.error(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="editProfileSection ">
        <form onSubmit={submitHandler}>
          <div className="eidtProfile-child">
            <h2>Edit profile</h2>
            <div className="change-profile-image ">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <img
                  src={profilePicturePreview || user.profilePicture}
                  alt=""
                />

                <div>
                  <span className="my-profile-username">{user.username}</span>
                  <span className="name d-block ">{user.fullname}</span>
                </div>
              </div>

              <div>
                <button
                  className="changeBtn"
                  onClick={() => setShowChangeProfilePhotoPopUp(true)}
                  type="button"
                >
                  Change photo
                </button>

                {showChangeProfilePhotoPopUp && (
                  <UploadProfilePhotoPopUp
                    setRemoveCurrentProfilePicture={
                      setRemoveCurrentProfilePicture
                    }
                    setProfilePicturePreview={setProfilePicturePreview}
                    setProfilePicture={setProfilePicture}
                    setShowChangeProfilePhotoPopUp={
                      setShowChangeProfilePhotoPopUp
                    }
                  />
                )}
              </div>
            </div>

            <div className="change-details">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  className="main-input edit-input"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="username ">User name</label>
                <input
                  type="text"
                  name="username"
                  className="main-input edit-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="gender">Gender</label>
                <select
                  value={gender}
                  onChange={selectHanlder}
                  name="gender"
                  className="main-input edit-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="bio">Bio</label>
                <textarea
                  value={bio}
                  name="bio"
                  className="enteredBio"
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-4 submitMain">
                <button
                  type="submit"
                  className="changeBtn submitBtn"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loader"></span> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
