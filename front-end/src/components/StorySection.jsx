export default function StorySection() {
  return (
    <>
      <div className="story-section d-flex " style={{ gap: "8px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((elem) => {
          return (
            <div key={elem}>
              <div className="story-image-main">
                <img
                  className="story-img"
                  src="https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg "
                  alt=""
                />
              </div>
              <div className="story-username-main">
                <p className="story-username mb-0">
                  {"beingsalmankhan".length > 9
                    ? "beingsalmankhan".slice(0, 9) + "..."
                    : "beingsalmankhan"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
