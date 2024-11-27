import { useDispatch } from "react-redux";
import { fetchAddMovie } from "../../redux/movie";
import "./MovieCard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [exists, setExists] = useState(false);

  const movieData = {
    name: movie.title,
    description: movie.overview,
    release_year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
    image_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
  };

  useEffect(() => {
    const checkMovieExists = async () => {
      const response = await fetch(
        `/api/movies/exists?name=${encodeURIComponent(
          movieData.name
        )}&release_year=${movieData.release_year}`
      );
      const data = await response.json();
      setExists(data.exists);
    };

    checkMovieExists();
  }, [movieData.name, movieData.release_year]);
  const handleAddMovie = () => {
    dispatch(fetchAddMovie(movieData));
    navigate('/');
  };

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={`${movie.title} Poster`}
        className="movie-poster"
      />
      <h3 className="movie-title">{movie.title}</h3>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average} / 10</p>
      <button 
        className="add-movie-btn" 
        onClick={handleAddMovie}
        disabled={exists}
      >
        {exists ? "Already Added" : "Add Movie"}
      </button>
    </div>
  );
};

export default MovieCard;
