import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchPanel from "./SearchPanel";
import UploadPostDialog from "./UploadPostDialog";
import DiscardDialog from "./DiscardDialog";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import NotificationPanel from "./NotificationPanel";
import axios from "axios";

export default function Asidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.realTimeNotification);
  const { latestMessages } = useSelector((state) => state.chat);

  const [showDropDown, setShowDropDown] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showUploadPostDialog, setShowUploadPostDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const location = useLocation();

  useEffect(() => {
    window.addEventListener("click", () => setShowDropDown(false));
  }, []);

  useEffect(() => {
    if (showUploadPostDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showUploadPostDialog]);

  function handleButtonClick(event) {
    // using event delegation
    event.stopPropagation();
    setShowDropDown(!showDropDown);
  }

  function isActive(path) {
    return path === location.pathname ? "fill" : "line";
  }

  function handleHideSearchPanel() {
    setShowSearchPanel(false);
  }

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "https://arman-instagram.onrender.com/api/users/logout",
        { withCredentials: true }
      );

      console.log(data);

      dispatch(setAuthUser(null));
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => setShowNotificationPanel(false));
  }, []);
  return (
    <>
      <div className="aside-main">
        <aside
          className={`d-flex flex-column justify-content-between ${
            showSearchPanel && "mini_aside"
          }`}
        >
          <div>
            <Link
              to="/"
              onClick={handleHideSearchPanel}
              className="logo-main d-block"
            >
              {!showSearchPanel ? (
                <img
                  src="/images/Instagram-Logo-2010-2013.png"
                  alt=""
                  className="home-logo"
                />
              ) : (
                <i className="ri-instagram-line logo"></i>
              )}
            </Link>

            <ul>
              <li>
                <Link onClick={handleHideSearchPanel} to="/" className="route">
                  <i className={`ri-home-8-${isActive("/")}`}></i>Home
                </Link>
              </li>
              <li>
                <button
                  className="route"
                  onClick={() => {
                    !showSearchPanel
                      ? setShowSearchPanel(true)
                      : setShowSearchPanel(false);
                  }}
                >
                  <i
                    className={`ri-search-${showSearchPanel ? "fill" : "line"}`}
                  ></i>
                  Search
                </button>
              </li>
              <li>
                <Link to="" onClick={handleHideSearchPanel} className="route">
                  <i className={`ri-compass-3-${isActive("/explore")}`}></i>
                  Explore
                </Link>
              </li>
              <li className="notification-li">
                <Link
                  to="/chat"
                  onClick={handleHideSearchPanel}
                  className="route"
                >
                  <i className={`ri-chat-history-${isActive("/chat")}`}></i>
                  Messages
                </Link>

                {latestMessages?.length !== 0 && (
                  <span className="notification">{latestMessages?.length}</span>
                )}
              </li>

              <li className="notification-li">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNotificationPanel
                      ? setShowNotificationPanel(false)
                      : setShowNotificationPanel(true);
                    handleHideSearchPanel();
                  }}
                  className="route"
                >
                  <i
                    className={`ri-heart-${
                      showNotificationPanel ? "fill" : "line"
                    }`}
                  ></i>
                  Notification
                </button>
                {notifications?.length !== 0 && (
                  <span className="notification">{notifications?.length}</span>
                )}
              </li>

              <li className="drop-down-main">
                <button className="route" onClick={handleButtonClick}>
                  <i className="ri-file-add-line"></i>Create
                </button>
                <ul
                  className={`drop-down ${showDropDown ? "d-block" : "d-none"}`}
                >
                  <li>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      to=""
                      className="route d-flex align-items-center justify-content-between"
                    >
                      Story <i className="ri-multi-image-line"></i>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUploadPostDialog(true);
                      }}
                      className="route d-flex align-items-center justify-content-between"
                    >
                      Post <i className="ri-multi-image-line"></i>
                    </button>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  onClick={handleHideSearchPanel}
                  to={`/profile/${user?._id}`}
                  className="route profile-button"
                >
                  <img
                    src={user?.profilePicture}
                    alt=""
                    className="profile-image"
                  />
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <button className="logoutBtn" onClick={handleLogout}>
            <i className="ri-logout-box-line"></i>Logout
          </button>
        </aside>
      </div>

      <SearchPanel
        setShowSearchPanel={setShowSearchPanel}
        showSearchPanel={showSearchPanel}
      />

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

      <NotificationPanel
        setShowNotificationPanel={setShowNotificationPanel}
        showNotificationPanel={showNotificationPanel}
      />
    </>
  );
}
