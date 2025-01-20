import { useSelector } from "react-redux";
import Post from "./Post";

export default function PostFeed() {
  const { posts } = useSelector((state) => state.post);

  return (
    <>
      <div className="post-section  mx-auto">
        {posts.length !== 0 &&
          posts.map((elem, i) => (
            <Post
              postAuthorID={elem?.authorID?._id}
              key={i}
              id={elem?._id}
              profilePicture={elem?.authorID?.profilePicture}
              username={elem?.authorID?.username}
              timestamp={elem?.time}
              image={elem?.image}
              like={elem?.likes}
              comments={elem?.comments}
              caption={elem?.caption}
            />
          ))}
      </div>
    </>
  );
}
