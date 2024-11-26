import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { Link } from "react-router-dom";
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
      setQuery("")
    }
  }

  return (
    <div className="nav-bar-div">
      <div className="logo-div">
        <Link className="logo" to="/">MOVIE MATE</Link>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <input 
          className="search-input"
          type='text'
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="search for a movie..." 
        />
        <button className="search-button" type="submit" onClick={handleSearch}>Search</button>
      </form>
      <div className="profile-div">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
