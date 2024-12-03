import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="profile-btn-container">
        <button className="profile-btn" onClick={toggleMenu}>
          <FaUserCircle />
        </button>
        {showMenu && (
          <ul className={ulClassName} ref={ulRef}>
            {user ? (
              <>
                <li className="user-name">Welcome, {user.username}</li>
                <li className="user-email">{user.email}</li>
                <li>
                  <Link className="my-watchlist" to="/create-new-watchlist">
                    My Watchlist
                  </Link>
                </li>
                <li>
                  <Link className="my-movies" to="/mymovies">
                    My Movies
                  </Link>
                </li>
                <li>
                  <button className="log-out" onClick={logout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
