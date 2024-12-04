import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMovies, fetchDeleteMovie } from "../../redux/movie";
import './MyMovies.css'

const MyMovies = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user?.id); // Assumes session stores logged-in user info
  const myMovies = useSelector((state) => state.movies.allMovies);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserMovies(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveMovie = (movieId) => {
    dispatch(fetchDeleteMovie(movieId));
  };

  if (!userId) {
    return <p>Please log in to view your movies.</p>;
  }

  return (
    <div className="my-movies-container">
      <h1 className="my-movies-title">My Movies</h1>
      {myMovies.length > 0 ? (
        <div className="movies-list">
          {myMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.image_url}`}
                alt={`${movie.name} Poster`}
                className="movie-poster"
              />
              <h3 className="movie-title">{movie.name}</h3>
              <button
                className="delete-movie-btn"
                onClick={() => handleRemoveMovie(movie.id)}
              >
                Remove Movie
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="message-text">You haven't added any movies yet.</p>
      )}
    </div>
  );
};

export default MyMovies;