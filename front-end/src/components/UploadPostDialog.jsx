import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { setAuthUser } from "../redux/authSlice";

export default function UploadPostDialog({
  setShowDiscardDialog,
  setShowUploadPostDialog,
}) {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  console.log(posts);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("image", image);
      const { data } = await axios.post(
        "https://arman-instagram.onrender.com/api/posts/add",
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setPosts([data.post, ...posts]));
      dispatch(
        setAuthUser({ ...user, ["posts"]: [...user.posts, data.post._id] })
      );
      // dispatch(
      //   setUserProfile({
      //     ...userProfile,
      //     posts: [...userProfile.posts, data.post._id],
      //   })
      // );

      console.log("Post dialog box has been closed!");
      setCaption("");
      setImage("");
      setImagePreviewSrc("");
      setShowUploadPostDialog(false);
      console.log("Post Uploaded!");

      return toast.success("post uploaded!", {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.log(error);

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
    } finally {
      setLoading(false);
    }
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreviewSrc(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const inputHandler = (e) => {
    setCaption(e.target.value);
  };

  return (
    <>
      <div className="back-view d-flex justify-content-center align-items-center">
        <div className="uploadDialog">
          <form onSubmit={submitHandler} style={{ height: "100%" }}>
            <div className="header">
              <div className="d-flex justify-content-between align-items-center">
                <i
                  onClick={() => {
                    console.log("Clicked");
                    setShowDiscardDialog(true);
                  }}
                  className="ri-arrow-left-long-fill"
                ></i>
                <h4 className="m-0">Create new post</h4>
                <button className="shareBtn" type="submit" disabled={loading}>
                  {loading ? <span className="loader"></span> : "Share"}
                </button>
              </div>
            </div>
            <div className=" h-full image-and-button-main">
              <div className="imageAndButton">
                {imagePreviewSrc ? (
                  <div>
                    <img
                      className="image-post-preview"
                      src={imagePreviewSrc}
                      alt=""
                    />
                  </div>
                ) : (
                  <div>
                    <i className="ri-multi-image-line"></i>
                    <input
                      onChange={fileHandler}
                      type="file"
                      id="image"
                      className="d-none"
                    />
                    <label htmlFor="image" className="selectImageBtn d-block">
                      Select from computer
                    </label>
                  </div>
                )}
              </div>

              <div className="input-main">
                <div>
                  <div className="d-flex align-items-center  mt-3 mb-3">
                    <img src={user.profilePicture} alt="" />
                    <span className="m-0">{user.username}</span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={inputHandler}
                    name="caption"
                    placeholder="caption..."
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
