import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetUnReadCount } from "../redux/rtnSlice";

export default function NavBar() {
  const { notifications, unReadCount } = useSelector(
    (state) => state.realTimeNotification
  );
  const dispatch = useDispatch();

  console.log(unReadCount);

  return (
    <>
      <div className="nav-main">
        <nav className="d-flex align-items-center justify-content-between">
          <Link to="/">
            <img
              src="/images/Instagram-Logo-2010-2013.png"
              alt=""
              className="home-logo"
            />
          </Link>
          <ul>
            <li className="d-inline-block mx-2">
              <Link
                onClick={() => {
                  dispatch(resetUnReadCount());
                  console.log(unReadCount);
                }}
                to="/notifications"
                className="notification-route"
              >
                <i className="ri-heart-line"></i>
                {unReadCount !== 0 && (
                  <span className="notification">{unReadCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
