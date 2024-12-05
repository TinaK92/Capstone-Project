import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUpdateMovie } from "../../redux/movie";
import "./EditMoviePage.css";
import "../MovieDetailsPage/MovieDetailsPage.css";

const EditMoviePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  // const user = useSelector((state) => state.session.user);
  const movie = useSelector((state) => state.movies.selectedMovie);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //     dispatch(fetchUpdateMovie(id))
  // }, [dispatch, id])

  useEffect(() => {
    if (movie) {
      setDescription(movie.description);
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrors({ description: "Description cannot be empty" });
      return;
    }

    const updatedMovie = {
      ...movie,
      description: description,
    };

    const response = await dispatch(fetchUpdateMovie(id, updatedMovie));
    if (response?.error) {
      setErrors({ server: response.error });
    } else {
      alert("Movie updated successfully");
      navigate(`/movies/${id}`);
    }
  };

  if (!movie) {
    return <p>Loading movie info...</p>;
  }

  return (
    <>
      <h1 className="edit-title">Edit Movie</h1>
      <div className="movie-details-div">
        <img
          src={`${movie.image_url}`}
          alt={`${movie.name} Poster`}
          className="movie-details-poster"
        />
        <div className="movie-details-info">
          <h3 className="movie-details-title">{movie.name}</h3>
          <h3 className="edit-text">Can you write it better?</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-details">
              <label>Description:</label>
              <textarea
                className="text-box"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                cols="40"
              />
              {errors.description && (
                <p className="error">{errors.description}</p>
              )}
              {errors.server && <p className="error">{errors.server}</p>}
            </div>
            <div className="submit-btn">
              <button className="submit-update" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditMoviePage;
