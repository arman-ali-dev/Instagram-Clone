import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchPanel from "./SearchPanel";
import UploadPostDialog from "./UploadPostDialog";
import Cookies from "js-cookie";
import DiscardDialog from "./DiscardDialog";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import NotificationPanel from "./NotificationPanel";

export default function MiniAsideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.realTimeNotification);

  const [showDropDown, setShowDropDown] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showUploadPostDialog, setShowUploadPostDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const location = useLocation();

  useEffect(() => {
    window.addEventListener("click", () => {
      setShowDropDown(false);
      setShowNotificationPanel(false);
      setShowSearchPanel(false);
    });
  }, []);

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

  function handleLogout() {
    Cookies.remove("token");
    dispatch(setAuthUser(null));
    navigate("/login");
  }
  return (
    <>
      <div className="miniAside-main">
        <aside
          className={`d-flex   flex-column justify-content-between ${
            showSearchPanel && "mini_aside"
          }`}
        >
          <div>
            <Link
              to="/"
              onClick={handleHideSearchPanel}
              className="logo-main d-block"
            >
              <i className="ri-instagram-line logo"></i>
            </Link>

            <ul>
              <li>
                <Link onClick={handleHideSearchPanel} to="/" className="route">
                  <i className={`ri-home-8-${isActive("/")}`}></i>
                </Link>
              </li>
              <li>
                <button
                  className="route"
                  onClick={(e) => {
                    e.stopPropagation();
                    !showSearchPanel
                      ? setShowSearchPanel(true)
                      : setShowSearchPanel(false);
                  }}
                >
                  <i
                    className={`ri-search-${showSearchPanel ? "fill" : "line"}`}
                  ></i>
                </button>
              </li>
              <li>
                <Link to="" onClick={handleHideSearchPanel} className="route">
                  <i className={`ri-compass-3-${isActive("/explore")}`}></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  onClick={handleHideSearchPanel}
                  className="route"
                >
                  <i className={`ri-chat-history-${isActive("/chat")}`}></i>
                </Link>
              </li>

              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNotificationPanel
                      ? setShowNotificationPanel(false)
                      : setShowNotificationPanel(true);
                    handleHideSearchPanel();
                  }}
                  className="route notification-button"
                >
                  <i className="ri-heart-line"></i>

                  {notifications?.length !== 0 && (
                    <span className="notification">
                      {notifications?.length}
                    </span>
                  )}
                </button>
              </li>

              <li className="drop-down-main">
                <button className="route" onClick={handleButtonClick}>
                  <i className="ri-file-add-line"></i>
                </button>
                <ul
                  className={`drop-down ${showDropDown ? "d-block" : "d-none"}`}
                >
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUploadPostDialog(true);
                      }}
                      className="route d-flex align-items-center  justify-content-between"
                    >
                      <i className="ri-multi-image-line"></i>
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
                </Link>
              </li>
            </ul>
          </div>

          <button className="logoutBtn" onClick={handleLogout}>
            <i className="ri-logout-box-line"></i>
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
