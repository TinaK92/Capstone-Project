import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDeleteMovie, fetchGetMovie } from "../../redux/movie";
import DeleteMovieModal from "../DeleteMovieModal/DeleteMovieModal";
import { useModal } from "../../context/Modal";
import "./MovieDetailsPage.css";

export const MovieDetailsPage = () => {
  const { setModalContent, closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.session.user);
  const movie = useSelector((state) => state.movies.selectedMovie);

  useEffect(() => {
    dispatch(fetchGetMovie(id));
  }, [dispatch, id]);

  if (!movie) {
    return <p>Movie not found!</p>;
  }

  const isUserOwner = user.id === movie.user_id;

  const handleEdit = (id) => {
    navigate(`/movies/${id}/edit`);
  };

  const handleDelete = (id) => {
    setModalContent(
      <DeleteMovieModal
        onConfirm={() => {
          dispatch(fetchDeleteMovie(id)).then(() => {
            closeModal();
            navigate("/");
          });
        }}
        onCancel={closeModal}
      />
    );
  };

  return (
    <div className="movie-details-div">
      <img
        src={`${movie.image_url}`}
        alt={`${movie.title} Poster`}
        className="movie-details-poster"
      />
      <div className="movie-details-info">
      <h3 className="movie-details-title">{movie.name}</h3>
      <p>Release Date: {movie.release_year}</p>
      <p>Description: {movie.description} </p>
      <div>
        {isUserOwner && (
          <div className="movie-actions">
            <button 
                    className="edit-details-btn"
                    onClick={() => handleEdit(movie.id)}
                >
                    Edit
                </button>
                <button 
                    className="delete-details-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(movie.id);
                    }}
                >
                    Delete
                </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
