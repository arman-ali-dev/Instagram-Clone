import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UploadPostDialog from "./UploadPostDialog";
import { useState, useSyncExternalStore } from "react";
import DiscardDialog from "./DiscardDialog";

export default function BottomNavBar() {
  const { user } = useSelector((state) => state.auth);
  const { latestMessages } = useSelector((state) => state.chat);
  const location = useLocation();

  const [showUploadPostDialog, setShowUploadPostDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  return (
    <>
      <div className="bottom-navbar">
        <ul>
          <li>
            <Link to="/">
              <i
                className={`ri-home-8-${
                  location.pathname === "/" ? "fill" : "line"
                }`}
              ></i>
            </Link>
          </li>

          <li>
            <Link to="/search">
              <i className="ri-search-line"></i>
            </Link>
          </li>
          <li>
            <button onClick={() => setShowUploadPostDialog(true)}>
              <i className="ri-file-add-line"></i>
            </button>
          </li>

          <li className="notification-li">
            <Link to="/chat">
              <i className="ri-chat-history-line"></i>
              {latestMessages?.length !== 0 && (
                <span className="notification">{latestMessages?.length}</span>
              )}
            </Link>
          </li>

          <li>
            <Link to={`/profile/${user?._id}`} className="route profile-button">
              <img
                src={user?.profilePicture}
                alt=""
                className="profile-image"
              />
            </Link>
          </li>
        </ul>
      </div>

      {showUploadPostDialog && (
        <UploadPostDialog
          setShowUploadPostDialog={setShowUploadPostDialog}
          setShowDiscardDialog={setShowDiscardDialog}
        />
      )}

      {showDiscardDialog && (
        <DiscardDialog
          setShowUploadPostDialog={setShowUploadPostDialog}
          setShowDiscardDialog={setShowDiscardDialog}
        />
      )}
    </>
  );
}
