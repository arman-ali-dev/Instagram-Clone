import MiniAsideBar from "../components/MiniAsideBar";
import UserWindow from "../components/UserWindow";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  return (
    <>
      <div className="d-flex" style={{ width: "100%" }}>
        <MiniAsideBar />
        <div className="chat-section">
          <UserWindow />
          <ChatWindow />
        </div>
      </div>
    </>
  );
}
