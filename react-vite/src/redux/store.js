import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import movieReducer from "./movie";
import movieDbReducer from "./themoviedb";
import watchlistReducer from "./watchlist";
import categoryReducer from "./category";


const rootReducer = combineReducers({
  session: sessionReducer,
  movies: movieReducer,
  movieDb: movieDbReducer,
  watchlist: watchlistReducer,
  categories: categoryReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
