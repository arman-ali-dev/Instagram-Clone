import PostCommentsDialog from "./PostCommentsDialog";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import FollowAndDeletePopUp from "./FollowAndDeletePopUp";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { setAuthUser } from "../redux/authSlice";
import { handleLike } from "../../utils/handleLike";
import { commentHandler } from "../../utils/handleComment";
import { handleBookmark } from "../../utils/handleBookmark";

export default function Post({
  profilePicture,
  username,
  id,
  timestamp,
  image,
  like,
  comments,
  caption,
  postAuthorID,
}) {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [captionLen, setCaptionLen] = useState(113);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showLessBtn, setLessBtn] = useState(false);
  const [showPostCommentsDialog, setShowPostCommentsDialog] = useState(false);
  const [content, setContent] = useState("");
  const [disablePostBtn, setDisablePostBtn] = useState(true);
  const [showEmogiPicker, setShowEmogiPicker] = useState(false);
  const [postID, setPostID] = useState(null);
  const [showFollowAndDeletePopUp, setShowFollowAndDeletePopUp] =
    useState(false);

  const inputHandler = (e) => {
    if (e.target.value.length > 0) {
      setDisablePostBtn(false);
    } else {
      setDisablePostBtn(true);
    }

    setContent(e.target.value);
  };

  useEffect(() => {
    window.addEventListener("click", () => setShowEmogiPicker(false));
  }, []);

  useEffect(() => {
    if (showFollowAndDeletePopUp || showPostCommentsDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFollowAndDeletePopUp, showPostCommentsDialog]);

  const time = (msgTimeStamp) => {
    const date = new Date().getTime();
    let time = (date - msgTimeStamp) / 1000;

    let timeStr = "Just now";
    if (time >= 86400) {
      time = time / 24 / 60 / 60;
      timeStr = Math.floor(time) + " day";
    } else if (time >= 3600) {
      time = time / 60 / 60;
      timeStr = Math.floor(time) + " h";
    } else if (time >= 60) {
      time /= 60;
      timeStr = Math.floor(time) + " m";
    }
    return timeStr;
  };

  const handleEmogiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
    setDisablePostBtn(false);
  };

  return (
    <>
      <div className="main-content mt-5">
        <div className="post-details" style={{ position: "relative" }}>
          <div className="  d-flex justify-content-between align-items-center px-2">
            <div className="user-details d-flex align-items-center gap-2">
              <div className="user-image-main">
                <img className="user-image" src={profilePicture} alt="" />
              </div>
              <span className="username">{username}</span>
              <span className="time">• {time(timestamp)}</span>
            </div>
            <div>
              <span
                id={id}
                className="three-dot"
                onClick={(e) => {
                  setPostID(e.currentTarget.id);
                  setShowFollowAndDeletePopUp(true);
                }}
              >
                <i className="ri-more-fill"></i>
              </span>
            </div>
          </div>

          <div className="post mt-2">
            <img className="post-image" src={image} alt="" />
          </div>
        </div>

        <div className="mt-2 icons d-flex justify-content-between px-2">
          <div className=" d-flex iconsChild">
            <div className="d-flex gap-2 align-items-center">
              <i
                onClick={() => handleLike(id, posts, user, dispatch, setPosts)}
                className={`ri-heart-${
                  like?.includes(user?._id) ? "fill liked" : "line disliked"
                }`}
              ></i>
              <span className="likeCount">{like?.length}</span>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <i
                className="ri-chat-3-line"
                onClick={() => setShowPostCommentsDialog(true)}
              ></i>{" "}
              <span className="likeCount">{comments?.length}</span>
            </div>
            <i className="ri-send-plane-line"></i>
          </div>
          <div>
            <i
              onClick={() => handleBookmark(id, user, dispatch, setAuthUser)}
              className={`ri-bookmark-${
                user?.bookmarks.includes(id) ? "fill" : "line"
              }`}
            ></i>
          </div>
        </div>

        {showPostCommentsDialog && (
          <PostCommentsDialog
            caption={caption}
            id={id}
            like={like}
            comments={comments}
            profilePicture={profilePicture}
            username={username}
            image={image}
            setShowPostCommentsDialog={setShowPostCommentsDialog}
          />
        )}

        <div className="caption px-2">
          <p className="caption-description">
            <span className="caption-username">{username}</span>
            {caption?.length > 76 ? (
              <>
                {caption.slice(0, captionLen)}

                {showMoreBtn && (
                  <span
                    onClick={() => {
                      setCaptionLen(elem?.caption.length);
                      setShowMoreBtn(false);
                      setLessBtn(true);
                    }}
                    className="d-block moreBtn"
                  >
                    More...
                  </span>
                )}

                {showLessBtn && (
                  <span
                    onClick={() => {
                      setCaptionLen(113);
                      setLessBtn(false);
                      setShowMoreBtn(true);
                    }}
                    className="d-block moreBtn"
                  >
                    Less...
                  </span>
                )}
              </>
            ) : (
              caption
            )}
          </p>
        </div>

        <div className="comments px-2">
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
                className="imogi"
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
                className="postBtn"
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
          </form>
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
