import PostFeed from "./PostFeed";
import StorySection from "./StorySection";

export default function MainContent() {
  return (
    <>
      <div className="d-block ">
        <StorySection />
        <PostFeed />
      </div>
    </>
  );
}
