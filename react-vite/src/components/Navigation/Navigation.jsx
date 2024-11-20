import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMovies } from '../../redux/themoviedb';
import "./Navigation.css";

function Navigation() {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(fetchMovies(query))
      navigate('/movies')
    }
  }

  return (
    <div className="nav-bar-div">
      <div className="logo-div">
        <NavLink className="logo" to="/">MovieMate</NavLink>
      </div>
      <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search for a movie..." />
      <button className="search-button" onClick={handleSearch}>Search</button>
      <div className="profile-div">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
