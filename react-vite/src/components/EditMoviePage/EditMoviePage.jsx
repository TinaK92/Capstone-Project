import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUpdateMovie } from "../../redux/movie";
import { fetchAllCategories } from "../../redux/category";
import "./EditMoviePage.css";
import "../MovieDetailsPage/MovieDetailsPage.css";

const EditMoviePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const movie = useSelector((state) => state.movies.selectedMovie);
  const categories = useSelector((state) => state.categories.categories);
  console.log("Redux Categories: ", categories);
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Populate form fields when the movie or categories are loaded
  useEffect(() => {
    if (movie) {
      setDescription(movie.description || "");
      if (movie.categories && Array.isArray(movie.categories)) {
        setSelectedCategories(movie.categories.map((category) => category.id));
      }
    }
  }, [movie]);

  useEffect(() => {
    console.log("Fetching categories...");
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!description.trim()) {
      newErrors.description = "Description cannot be empty";
    }
    if (selectedCategories.length === 0) {
      newErrors.categories = "At least one genre must be selected";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedMovie = {
      ...movie,
      description,
      category_ids: selectedCategories, // Send selected category IDs to the backend
    };

    const response = await dispatch(fetchUpdateMovie(id, updatedMovie));
    if (response?.error) {
      setErrors({ server: response.error });
    } else {
      alert("Movie updated successfully");
      navigate(`/movies/${id}`);
    }
  };

  // Handle multi-select dropdown change
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );
    setSelectedCategories(selectedOptions);
  };

  if (!movie || !categories) {
    return <p>Loading movie info...</p>;
  }

  return (
    <>
      <h1 className="edit-title">Edit Movie</h1>
      <div className="movie-details-div">
        <img
          src={movie.image_url}
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
              <label>Genre:</label>
              <select
                className="dropdown"
                value={selectedCategories}
                onChange={handleCategoryChange}
                multiple
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categories && (
                <p className="error">{errors.categories}</p>
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
