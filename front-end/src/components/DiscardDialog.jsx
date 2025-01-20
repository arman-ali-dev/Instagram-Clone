export default function DiscardDialog({
  setShowDiscardDialog,
  setShowUploadPostDialog,
}) {
  return (
    <>
      <div className="back-view">
        <div className="unfollow-popup discardDialog">
          <ul>
            <li>
              <button
                className="discard-text"
                onClick={() => {
                  setShowUploadPostDialog(false);
                  setShowDiscardDialog(false);
                }}
              >
                Discard
              </button>
            </li>
            <li>
              <button onClick={() => setShowDiscardDialog(false)}>
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
