import { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import FollowAndDeletePopUp from "./FollowAndDeletePopUp";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { handleLike } from "../../utils/handleLike";
import { commentHandler } from "../../utils/handleComment";
import { handleBookmark } from "../../utils/handleBookmark";
import { setAuthUser } from "../redux/authSlice";

export default function PostCommentsDialog({
  setShowPostCommentsDialog,
  image,
  profilePicture,
  username,
  caption,
  like,
  comments,
  id,
  postAuthorID,
}) {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [disablePostBtn, setDisablePostBtn] = useState(true);
  const [showEmogiPicker, setShowEmogiPicker] = useState(false);
  const [showFollowAndDeletePopUp, setShowFollowAndDeletePopUp] =
    useState(false);

  const inputHandler = (e) => {
    if (e.target.value == "") {
      setDisablePostBtn(true);
    } else {
      setDisablePostBtn(false);
    }
    setContent(e.target.value);
  };

  const handleEmogiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
    setDisablePostBtn(false);
  };

  useEffect(() => {
    window.addEventListener("click", () => setShowEmogiPicker(false));
  }, []);

  return (
    <>
      <div
        className="back-view d-flex justify-content-center align-items-center"
        style={{ height: "100vh", position: "fixed" }}
      >
        <button
          onClick={() => setShowPostCommentsDialog(false)}
          type="button"
          className="close_btn"
        >
          <i className="ri-close-line"></i>
        </button>
        <div className="PostCommentsDialog">
          <div className="post-image-col ">
            <img className="post-image" src={image} alt="" />
          </div>

          <div className="content">
            <div>
              <div className="header d-flex  align-items-center">
                <div className="d-flex user-info  align-items-center justify-content-between">
                  <div>
                    <img src={profilePicture} alt="" />
                    <span className="username">{username}</span>
                  </div>
                  <div>
                    <span
                      className="three-dot"
                      onClick={() => setShowFollowAndDeletePopUp(true)}
                    >
                      <i className="ri-more-fill"></i>
                    </span>
                  </div>
                </div>

                <i
                  className="ri-arrow-left-s-line leftBtn"
                  onClick={() => setShowPostCommentsDialog(false)}
                ></i>

                <h2 className="m-0 ">Comments</h2>
              </div>
              <div className="comments">
                <div className="d-flex align-items-center">
                  <img src={profilePicture} alt="" />
                  <span className="username">{username}</span>

                  <p className="caption mb-0 ">{caption}</p>
                </div>

                {comments.map((elem) => (
                  <div
                    className="d-flex align-items-center mt-4"
                    key={elem._id}
                  >
                    <img src={elem.author.profilePicture} alt="" />
                    <span className="username">{elem.author.username}</span>

                    <p className="caption mb-0 ">{elem.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-form">
              {" "}
              <div className=" icons  d-flex justify-content-between">
                <div className=" d-flex iconsChild">
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      onClick={() =>
                        handleLike(id, posts, user, dispatch, setPosts)
                      }
                      className={`ri-heart-${
                        like.includes(user._id) ? "fill liked" : "line disliked"
                      }`}
                    ></i>
                    <span className="likeCount">{like.length}</span>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <i className="ri-chat-3-line"></i>{" "}
                    <span className="likeCount">{comments.length}</span>
                  </div>
                  <i className="ri-send-plane-line"></i>
                </div>
                <div>
                  <i
                    onClick={() =>
                      handleBookmark(id, user, dispatch, setAuthUser)
                    }
                    className={`ri-bookmark-${
                      user?.bookmarks.includes(id) ? "fill" : "line"
                    }`}
                  ></i>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commentHandler(
                    id,
                    content,
                    posts,
                    dispatch,
                    setContent,
                    setDisablePostBtn,
                    setPosts
                  );
                }}
                className="comment-form"
              >
                <div className="comment-main">
                  <span
                    className="imogi "
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmogiPicker(true);
                    }}
                  >
                    <i className="ri-emotion-happy-line"></i>
                  </span>
                  <input
                    value={content}
                    onChange={inputHandler}
                    type="text"
                    className="enteredComment"
                    placeholder="Add a comment..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className={`postBtn `}
                    disabled={disablePostBtn}
                  >
                    Post
                  </button>
                  <div onClick={(e) => e.stopPropagation()}>
                    {showEmogiPicker && (
                      <EmojiPicker
                        onEmojiClick={handleEmogiClick}
                        className="imogi_picker"
                      />
                    )}
                  </div>
                </div>
              </form>{" "}
            </div>
          </div>
        </div>
      </div>

      {showFollowAndDeletePopUp && (
        <FollowAndDeletePopUp
          postAuthorID={postAuthorID}
          postID={id}
          setShowFollowAndDeletePopUp={setShowFollowAndDeletePopUp}
        />
      )}
    </>
  );
}
