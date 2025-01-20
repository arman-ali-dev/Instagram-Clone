export default function UploadProfilePhotoPopUp({
  setShowChangeProfilePhotoPopUp,
  setProfilePicture,
  setProfilePicturePreview,
  setRemoveCurrentProfilePicture,
}) {
  const fileHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePicture(file);
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };

      fileReader.readAsDataURL(file);
    }

    setShowChangeProfilePhotoPopUp(false);
  };

  const handleRemoveProfilePiicture = () => {
    setProfilePicturePreview(
      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
    );
    setRemoveCurrentProfilePicture(true);
    setShowChangeProfilePhotoPopUp(false);
  };

  return (
    <>
      <div className="back-view">
        <div className="upload_pop_up">
          <h2 className="popUpHeading mb-0">Change Profile Photo</h2>
          <ul>
            <li>
              <input
                onChange={fileHandler}
                className="d-none"
                type="file"
                id="profile"
              />
              <label htmlFor="profile" className="d-block text-center button">
                Upload Photo
              </label>
            </li>
            <li>
              <button
                type="button"
                onClick={handleRemoveProfilePiicture}
                className="d-block text-center button"
              >
                Remove current Photo
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowChangeProfilePhotoPopUp(false)}
                className="d-block text-center button"
              >
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
