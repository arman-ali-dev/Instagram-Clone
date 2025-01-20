import { useState } from "react";
import PostCommentsDialog from "../components/PostCommentsDialog";

export default function UserBookmarkedPost({
  id,
  image,
  caption,
  like,
  comments,
  profilePicture,
  username,
  postAuthorID,
}) {
  const [showPostCommentsDialog, setShowPostCommentsDialog] = useState(false);

  return (
    <>
      <img
        onClick={() => setShowPostCommentsDialog(true)}
        src={image}
        alt=""
        key={id}
      />
      {showPostCommentsDialog && (
        <PostCommentsDialog
          postAuthorID={postAuthorID}
          caption={caption}
          id={id}
          like={like}
          comments={comments}
          profilePicture={profilePicture}
          username={username}
          image={image}
          setShowPostCommentsDialog={setShowPostCommentsDialog}
        />
      )}
    </>
  );
}
