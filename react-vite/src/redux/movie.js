// Action Type
const GET_ALL_MOVIES = "movies/GET_ALL_MOVIES";
const GET_A_MOVIE = "movies/GET_A_MOVIE";
const GET_USER_MOVIES = "movies/GET_USER_MOVIES";
const ADD_NEW_MOVIE = "movies/ADD_NEW_MOVIE";
const UPDATE_MOVIE = "movies/UPDATE_MOVIE";
const DELETE_MOVIE = "movies/DELETE_MOVIE";

// Actions
export const getAllMovies = (movies) => {
  return {
    type: GET_ALL_MOVIES,
    payload: movies,
  };
};

export const getAMovie = (movie) => {
  return {
    type: GET_A_MOVIE,
    payload: movie,
  };
};

export const getUserMovies = (movies) => {
  return {
    type: GET_USER_MOVIES,
    payload: movies,
  };
};

export const addNewMovie = (movie) => {
  return {
    type: ADD_NEW_MOVIE,
    payload: movie,
  };
};

export const updateMovie = (movie) => {
  return {
    type: UPDATE_MOVIE,
    payload: movie,
  };
};

export const deleteMovie = (movieId) => {
  return {
    type: DELETE_MOVIE,
    payload: movieId,
  };
};

// ---------- All Thunks -----------------------
// Get All Movies
export const fetchAllMovies = () => async (dispatch) => {
  const response = await fetch(`/api/movies`);
  if (response.ok) {
    const movies = await response.json();
    dispatch(getAllMovies(movies));
    return movies;
  }
};

// Get all Movies from a User
export const fetchUserMovies = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/user/${userId}`);
    if (response.ok) {
      const { movies } = await response.json();
      dispatch(getAllMovies(movies));
      return movies;
    } else {
      const errorText = await response.json();
      return { error: errorText };
    }
  } catch (error) {
    return { error: "Failed to fetch user movies." };
  }
};

// Get A Movie
export const fetchGetMovie = (id) => async (dispatch) => {
  const response = await fetch(`/api/movies/${id}`);
  if (response.ok) {
    const movie = await response.json();
    dispatch(getAMovie(movie));
    return movie;
  }
};

// Add A New Movie
export const fetchAddMovie = (formData) => async (dispatch) => {
  try {
    const response = await fetch("/api/movies/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const newMovie = await response.json();
      dispatch(addNewMovie(newMovie));
      return newMovie;
    } else {
      const errorText = await response.json();
      return { error: errorText };
    }
  } catch (error) {
    return { errors: "An error has occured" };
  }
};

// Update A Movie
export const fetchUpdateMovie = (movieId, updatedMovie) => async () => {
  try {
    const response = await fetch(`/api/movies/${movieId}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: updatedMovie.description }),
    });

    if (response.ok) {
      const updatedMovieData = await response.json();
      return updatedMovieData;
    } else {
      const error = await response.json();
      return { error: error.error };
    }
  } catch (error) {
    return { error: "Failed to update the movie" };
  }
};

// Delete A Movie
export const fetchDeleteMovie = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteMovie(id));
      return { message: "Movie has been successfully deleted" };
    } else {
      const errorText = await response.json();
      return { errors: errorText };
    }
  } catch (error) {
    return { errors: "An unexpected error has occured" };
  }
};

// State
const initialState = {
  allMovies: [],
  watchlistMovies: {},
  selectedMovie: {},
};

function movieReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_MOVIES:
      return { ...state, allMovies: action.payload };
    case GET_A_MOVIE:
      return { ...state, selectedMovie: action.payload };
    case GET_ALL_MOVIES:
      return { ...state, allMovies: action.payload };
    case ADD_NEW_MOVIE:
      return { ...state, allMovies: [...state.allMovies, action.payload] };
    case UPDATE_MOVIE:
      return {
        ...state,
        allMovies: state.allMovies.map((movie) =>
          movie.id === action.payload.id ? action.payload : movie
        ),
        watchlistMovies: {
          ...state.watchlistMovies,
          [action.payload.id]: action.payload,
        },
      };
    case DELETE_MOVIE:
      return {
        ...state,
        allMovies: state.allMovies.filter(
          (movie) => movie.id !== action.payload
        ),
        watchlistMovies:
          state.watchlistMovies.id === action.payload
            ? {}
            : state.watchlistMovies,
      };
    default:
      return state;
  }
}

export default movieReducer;
