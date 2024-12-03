import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { fetchAddMovieToWatchlist } from "../../redux/watchlist";
import './HomeMovie.css'

const HomeMovie = ({ movie }) => {
  const user = useSelector((state) => state.session.user);
  const watchlists = useSelector((state) => state.watchlist.myWatchlists);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [message, setMessage] = useState("");

  const movieNavigator = (id) => {
    if (!user) {
      navigate(`/login`);
    } else {
      navigate(`/movies/${id}`);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!selectedWatchlist) {
      setMessage("Please select a watchlist");
      return;
    }

    const response = await dispatch(fetchAddMovieToWatchlist(selectedWatchlist, movie.id));
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Movie added to watchlist successfully!");
    }
  };

  return (
    <div className="movie-card">
      <div onClick={() => movieNavigator(movie.id)}>
        <img
          src={`${movie.image_url}`}
          alt={`${movie.title} Poster`}
          className="movie-poster"
        />
        <h3 className="movie-title">{movie.name}</h3>
      </div>
      <div className="select-wl-btn">
        <select
          value={selectedWatchlist || ""}
          onChange={(e) => setSelectedWatchlist(e.target.value)}
        >
          <option value="" disabled>
            Select a Watchlist
          </option>
          {watchlists &&
            watchlists.map((watchlist) => (
              <option key={watchlist.id} value={watchlist.id}>
                {watchlist.name}
              </option>
            ))}
        </select>
        <button className="add-to-btn" onClick={handleAddToWatchlist}>Add to Watchlist</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default HomeMovie;
