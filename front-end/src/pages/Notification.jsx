import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationItem from "../components/NotificationItem";

export default function Notification() {
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state.realTimeNotification);
  return (
    <>
      <div className="notification-section">
        <div className="notification-header">
          <i
            onClick={() => navigate("/")}
            className="ri-arrow-left-s-line leftBtn"
          ></i>
          <h2 className="m-0">Notifications</h2>
        </div>

        <div className="mt-3">
          {notifications
            ?.slice()
            .reverse()
            .map((elem, i) => (
              <NotificationItem
                key={i}
                profilePicture={elem?.profilePicture}
                type={elem?.type}
                username={elem?.username}
                text={elem?.text}
                postImage={elem?.postImage}
                userID={elem?.userID}
              />
            ))}
        </div>
      </div>
    </>
  );
}
