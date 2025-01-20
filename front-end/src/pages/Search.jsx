import { useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const { suggestedUsers } = useSelector((state) => state.user);
  const [searchedKeywords, setSearchedKeywords] = useState("");

  const [users, setUsers] = useState([]);

  const searchHandler = (e) => {
    setSearchedKeywords(e.target.value);

    if (e.target.value) {
      const searchedUsers = suggestedUsers.filter((elem) =>
        elem.username
          .toLowerCase()
          .includes(
            searchedKeywords.toLowerCase() ||
              elem.fullname
                .toLowerCase()
                .includes(searchedKeywords.toLowerCase())
          )
      );
      setUsers(searchedUsers);
    } else {
      setUsers([]);
    }
  };
  return (
    <>
      <div className="search-section">
        <div className="search_header">
          <i
            onClick={() => navigate("/")}
            className="ri-arrow-left-long-fill leftBtn"
          ></i>
          <form>
            <div>
              <input
                value={searchedKeywords}
                onChange={searchHandler}
                type="text"
                className="main-input enteredSearchText"
                placeholder="Search"
              />
            </div>
          </form>
        </div>

        {users.length === 0 ? (
          <div className="search_bottom">
            <span>No recent searches</span>
          </div>
        ) : (
          <div className="searched_users">
            {users.map((user) => {
              return (
                <Link
                  key={user._id}
                  onClick={() => setShowSearchPanel(false)}
                  to={`/profile/${user._id}`}
                  className="mt-4 d-inline-block user-profile d-flex gap-2 align-items-center"
                >
                  <img src={user.profilePicture} alt="" />
                  <div>
                    <span className="user-profile-username">
                      {user.username}
                    </span>
                    <span className="name d-block ">{user.fullname}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
