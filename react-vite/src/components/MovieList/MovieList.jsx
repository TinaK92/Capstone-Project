
import { useSelector } from "react-redux";
import MovieCard from "../MovieCard/MovieCard";
import './MovieList.css'

const MovieList = () => {
  const movies = useSelector((state) => state.movieDb.movies);

  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
