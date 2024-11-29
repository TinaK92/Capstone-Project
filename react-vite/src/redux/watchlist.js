// Action Type
const GET_MY_WATCHLISTS = "myWatchlist/GET_MY_WATCHLISTS";
const GET_WATCHLIST_MOVIES = "watchlist/GET_WATCHLIST_MOVIES";
const GET_WATCHLIST_DETAILS = "watchlist/GET_WATCHLIST_DETAILS";
const ADD_MOVIE_TO_WATCHLIST = "watchlist/ADD_MOVIE_TO_WATCHLIST";
const CREATE_NEW_WATCHLIST = "myWatchlist/CREATE_NEW_WATCHLIST";
const DELETE_MOVIE_FROM_WATCHLIST = "watchlist/DELETE_MOVIE_FROM_WATCHLIST";
const DELETE_WATCHLIST = "watchlist/DELETE_WATCHLIST";

// Actions
export const getMyWatchlist = (watchlist) => {
  return {
    type: GET_MY_WATCHLISTS,
    payload: watchlist,
  };
};

export const getWatchlistMovies = (movies) => {
  return {
    type: GET_WATCHLIST_MOVIES,
    payload: movies,
  };
};

export const getWatchlistDetails = (watchlist) => {
  return {
    type: GET_WATCHLIST_DETAILS,
    payload: watchlist,
  };
};

export const addMovieToWatchlist = (movie) => {
  return {
    type: ADD_MOVIE_TO_WATCHLIST,
    payload: movie,
  };
};

export const createNewWatchlist = (watchlist) => {
  return {
    type: CREATE_NEW_WATCHLIST,
    payload: watchlist,
  };
};

export const deleteMovieFromWatchlist = (movieId, watchlistId) => {
  return {
    type: DELETE_MOVIE_FROM_WATCHLIST,
    payload: { movieId, watchlistId },
  };
};

export const deleteWatchlistAction = (watchlistId) => {
  return {
    type: DELETE_WATCHLIST,
    payload: watchlistId,
  };
};

// Thunk
export const fetchGetMyWatchlists = () => async (dispatch, getState) => {
  const currentUserId = getState()?.session?.user?.id;
  if (!currentUserId) {
    return { errors: "User is not logged in." };
  }
  try {
    const response = await fetch(`/api/watchlist/users/${currentUserId}`);
    if (response.ok) {
      const myWatchlist = await response.json();
      dispatch(getMyWatchlist(myWatchlist));
      return myWatchlist;
    }
  } catch (error) {
    return { errors: "An error fetching watchlist has occured" };
  }
};

export const fetchWatchlistMovies = (watchlistId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/watchlist/${watchlistId}/movies`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching watchlist movies:", errorText);
      throw new Error("Failed to fetch movies");
    }
    const movies = await response.json();
    dispatch(getWatchlistMovies(movies));
  } catch (error) {
    console.error("Error fetching watchlist movies:", error);
  }
};

export const fetchWatchlistDetails = (watchlistId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/watchlist/${watchlistId}`);
    if (response.ok) {
      const watchlist = await response.json();
      console.log("Fetched Watchlist Details:", watchlist); // Debug log
      dispatch(getWatchlistDetails(watchlist));
    } else {
      const errorText = await response.text();
      console.error("Error fetching watchlist details:", errorText);
    }
  } catch (error) {
    console.error("Error fetching watchlist details:", error);
  }
};

export const fetchAddMovieToWatchlist = (watchlistId, movieId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/watchlist/${watchlistId}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id: movieId }),
    });

    if (response.ok) {
      const movie = await response.json();
      dispatch(addMovieToWatchlist(movie));
      return movie;
    } else {
      const error = await response.json();
      return { error: error.error };
    }
  } catch (error) {
    return { error: "Failed to add movie to watchlist" };
  }
};


export const fetchCreateNewWatchlist = (formData) => async (dispatch) => {
  try {
    const response = await fetch("/api/watchlist/create_new_watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const newWatchlist = await response.json();
      dispatch(createNewWatchlist(newWatchlist));
      return newWatchlist;
    } else {
      const errorText = await response.json();
      return { error: errorText };
    }
  } catch (error) {
    return { errors: "An error has occured" };
  }
};

export const fetchDeleteMovieFromWatchlist =
  (watchlistId, movieId) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/watchlist/${watchlistId}/movies/${movieId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(deleteMovieFromWatchlist(movieId, watchlistId)); // Dispatch the action
        return { message: "Movie successfully removed from watchlist" };
      } else {
        const error = await response.json();
        console.error("Error removing movie from watchlist:", error);
        return {
          error: error.error || "Failed to remove movie from watchlist",
        };
      }
    } catch (error) {
      console.error("Error deleting movie from watchlist:", error);
      return { error: "An error occurred while removing the movie" };
    }
  };

export const fetchDeleteWatchlist = (watchlistId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/watchlist/${watchlistId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(deleteWatchlistAction(watchlistId));
      return data; // Return success message
    } else {
      const error = await response.json();
      return { error: error.error };
    }
  } catch (error) {
    return { error: "Failed to delete watchlist" };
  }
};

// State
const initialState = {
  myWatchlists: [],
  watchlist: [],
  selectedMovies: [],
  selectedWatchlist: null,
};

// Reducer
function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MY_WATCHLISTS:
      return { ...state, myWatchlists: action.payload };
    case GET_WATCHLIST_MOVIES:
      console.log(
        "Reducer: Updating selectedMovies with payload:",
        action.payload
      ); // Debugging
      return {
        ...state,
        selectedMovies: action.payload.length
          ? action.payload
          : state.selectedMovies,
      };
    case GET_WATCHLIST_DETAILS:
      console.log("Updating selectedWatchlist:", action.payload); // Debug log
      return { ...state, selectedWatchlist: action.payload };
    case ADD_MOVIE_TO_WATCHLIST:
      return {
        ...state,
        selectedMovies: [...state.selectedMovies, action.payload],
      };
    case CREATE_NEW_WATCHLIST:
      return { ...state, watchlist: action.payload };
    case DELETE_MOVIE_FROM_WATCHLIST: {
      const updatedMovies = state.selectedMovies.filter(
        (movie) => movie.id !== action.payload.movieId
      );
      return {
        ...state,
        selectedMovies: updatedMovies,
      };
    }
    case DELETE_WATCHLIST:
      return {
        ...state,
        myWatchlists: state.myWatchlists.filter(
          (watchlist) => watchlist.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

export default watchlistReducer;
