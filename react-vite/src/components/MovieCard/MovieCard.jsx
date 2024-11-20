import { useDispatch } from "react-redux";
import { fetchAddMovie } from "../../redux/movie";

const MovieCard = ({ movie }) => {
    const dispatch = useDispatch();

    const handleAddMovie = () => {
        const movieData = {
            name: movie.title,
            description: movie.overview,
            release_year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
            image_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        }
        dispatch(fetchAddMovie(movieData))
    }


    return (
        <div className="movie-card">
            <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={`${movie.title} Poster`}
                className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average} / 10</p>
            <button className="add-movie-btn" onClick={handleAddMovie} >Add Movie</button>
        </div>
    );
};

export default MovieCard;