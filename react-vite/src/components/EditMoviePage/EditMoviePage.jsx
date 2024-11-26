import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUpdateMovie } from "../../redux/movie";

const EditMoviePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useSelector((state) => state.session.user);
    const movie = useSelector((state) => state.movies.selectedMovie);
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
 
    // useEffect(() => {
    //     dispatch(fetchUpdateMovie(id))
    // }, [dispatch, id])

    useEffect(() => {
        if (movie) {
            setDescription(movie.description)
        }
    }, [movie]);

    const handleSubmit= async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setErrors({ description: "Description cannot be empty" });
            return;
        }

        const updatedMovie = {
            ...movie, 
            description: description,
        }

        const response = await dispatch(fetchUpdateMovie(id, updatedMovie));
        if (response?.error) {
            setErrors({ server: response.error });
        } else {
            alert("Movie updated successfully");
            navigate(`/movies/${id}`);
        }
    }

    if (!movie) {
        return <p>Loading movie info...</p>
    }

    return (
        <div>
            <h1>Edit Movie</h1>
            <img
                src={`${movie.image_url}`}
                alt={`${movie.name} Poster`}
                className="movie-poster"
            />
            <h3 className="movie-title">{movie.name}</h3>
            <p>Release Date: {movie.release_year}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        cols="40"
                    />
                </label>
                {errors.description && <p className="error">{errors.description}</p>}
                {errors.server && <p className="error">{errors.server}</p>}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditMoviePage;