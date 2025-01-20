import { useSelector } from "react-redux";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({ showNotificationPanel }) {
  const { notifications } = useSelector((state) => state.realTimeNotification);

  return (
    <>
      <div
        className={`notification-panel ${
          showNotificationPanel
            ? "show_notification_panel"
            : "hide_notification_panel"
        }`}
      >
        <h3>Notifications</h3>

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
