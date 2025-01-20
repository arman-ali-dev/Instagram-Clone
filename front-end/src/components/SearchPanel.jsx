import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SearchPanel({ showSearchPanel, setShowSearchPanel }) {
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
      <div
        className={`search_panel ${
          showSearchPanel ? "show_search_panel" : "hide_search_panel"
        }  `}
      >
        <div className="search_header">
          <h2 className="searchHeading">Search</h2>
          <form>
            <div>
              <input
                value={searchedKeywords}
                onChange={searchHandler}
                type="text"
                className="main-input enteredSearchText"
                placeholder="Search"
              />
              <span
                className="cancel_icon"
                onClick={() => {
                  setSearchedKeywords("");
                  setUsers([]);
                }}
              >
                <i className="ri-close-circle-fill"></i>
              </span>
            </div>
          </form>
        </div>

        {users?.length === 0 ? (
          <div className="search_bottom">
            <h4>Recent</h4>
            <span>No recent searches</span>
          </div>
        ) : (
          <div className="searched_users">
            {users?.map((user) => {
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
