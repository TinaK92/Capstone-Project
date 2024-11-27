import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchWatchlistMovies, fetchWatchlistDetails } from "../../redux/watchlist";

import WatchlistMovieCard from "../WatchlistMovieCard/WatchlistMovieCard";
// import { fetchDeleteWatchlist } from "../../redux/watchlist";


const WatchlistDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.watchlist.selectedMovies);
  const watchlist = useSelector((state) => state.watchlist.selectedWatchlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching watchlist details for ID:", id);
        await dispatch(fetchWatchlistDetails(id)); // Fetch watchlist details
        console.log("Fetching watchlist movies for ID:", id);
        await dispatch(fetchWatchlistMovies(id)); // Fetch movies in the watchlist
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [dispatch, id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!id) {
    return <p>Error loading watchlist details.</p>;
  }

  return (
    <div>
      <h1>Watchlist Movies</h1>
      <h2>{watchlist.name}</h2>
      {movies && movies.length > 0 ? (
        <div className="movie-list">
        {movies.map((movie) => (
          <WatchlistMovieCard key={movie.id} movie={movie} watchlistId={id} /> // Pass movie to MovieCard
        ))}
      </div>
      ) : (
        <p>No movies found in this watchlist.</p>
      )}
    </div>
  );
};

export default WatchlistDetails;