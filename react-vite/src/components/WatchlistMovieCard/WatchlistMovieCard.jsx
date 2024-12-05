import { useDispatch } from "react-redux";
import { fetchDeleteMovieFromWatchlist } from "../../redux/watchlist";
import './WatchlistMovieCard.css'



const WatchlistMovieCard = ({ movie, watchlistId }) => {
  const dispatch = useDispatch();


  const handleRemoveMovie = async () => {
    if (!watchlistId) {
        console.error("Missing watchlistId!");
        return;
    }
    const result = await dispatch(
      fetchDeleteMovieFromWatchlist(watchlistId, movie.id)
      
    );
    if (result?.message) {
      alert(result.message);
    } else {
      alert(result?.error || "Failed to remove movie/");
    }
  };

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.image_url}`}
        alt={`${movie.title} Poster`}
        className="movie-poster"
      />
      <h3 className="movie-title">{movie.name}</h3>
      <p className="date">Release Date: {movie.release_year} </p>
      <p className="description">Description: {movie.description} </p>
      <button
        className="delete-movie-btn"
        onClick={handleRemoveMovie}
      >
        Remove Movie
      </button>
    </div>
  );
};

export default WatchlistMovieCard;
