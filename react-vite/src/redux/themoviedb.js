
// Action Types
export const FETCH_MOVIE_REQUEST = 'FETCH_MOVIE_REQUEST'
export const FETCH_MOVIE_SUCCESS = 'FETCH_MOVIE_SUCCESS'
export const FETCH_MOVIE_FAILURE = 'FETCH_MOVIE_FAILURE'

// Action Creators
export const fetchMovieRequest = () => {
    return {
        type: FETCH_MOVIE_REQUEST,
    }
};

export const fetchMovieSuccess = (movies) => {
    return {
        type: FETCH_MOVIE_SUCCESS,
        payload: movies,
    }
}

export const fetchMovieFailure = (error) => {
    return {
        type: FETCH_MOVIE_FAILURE,
        payload: error,
    }
}

// THUNKS ---------------------
export const fetchMovies = (query) => async (dispatch) => {
    dispatch(fetchMovieRequest());
    try {
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        dispatch(fetchMovieSuccess(data.results));
    } catch (error) {
        dispatch(fetchMovieFailure(error.message));
    }
};

// default state
const initialState = {
    loading: false,
    movies: [],
    error: null,
}

// Reducer

const movieDbReducer = (state=initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_REQUEST: 
            return {
                ...state,
                loading: true,
                error: null,
            }
        case FETCH_MOVIE_SUCCESS:
            return {
                ...state,
                loading: false,
                movies: action.payload,
            }
        case FETCH_MOVIE_FAILURE: 
            return {
                ...state, 
                loading: false, 
                error: action.payload,
            }
        default:
            return state
    }
}

export default movieDbReducer;