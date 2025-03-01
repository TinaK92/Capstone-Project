import { useDispatch } from "react-redux";
import { fetchAddMovie } from "../../redux/movie";
import "./MovieCard.css";
import { useState, useEffect } from "react";


const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
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
    setExists(true);
    dispatch(fetchAddMovie(movieData));
  };

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={`${movie.title} Poster`}
        className="movie-poster"
      />
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-info">Release Date: {movie.release_date}</p>
      <p className="movie-info">Rating: {movie.vote_average} / 10</p>
      <div className="movie-btn-div">
        <button 
          className="add-movie-btn" 
          onClick={handleAddMovie}
          disabled={exists}
        >
          {exists ? "Already Added" : "Add Movie"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
