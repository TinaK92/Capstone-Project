import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import MovieList from "../components/MovieList/MovieList";
import { HomePage } from "../components/HomePage/HomePage";
import { MovieDetailsPage } from "../components/MovieDetailsPage/MovieDetailsPage";
import EditMoviePage from "../components/EditMoviePage/EditMoviePage";
import { CreateNewWatchListForm } from "../components/MyWatchlist/CreateNewWatchlistForm";
import WatchlistDetails from "../components/WatchlistDetails/WatchlistDetails";
import MyMovies from "../components/MyMovies/MyMovies";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/movies",
        element: <MovieList />,
      },
      {
        path: "/movies/:id",
        element: <MovieDetailsPage />,
      },
      {
        path: "/movies/:id/edit",
        element: <EditMoviePage />,
      },
      {
        path: "/create-new-watchlist",
        element: <CreateNewWatchListForm />,
      },
      {
        path: "/watchlists/:id",
        element: <WatchlistDetails />
      }, 
      {
        path: '/mymovies',
        element: <MyMovies />
      }
    ],
  },
]);
