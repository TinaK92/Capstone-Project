import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllMovies } from "../../redux/movie";
import HomeMovie from "../HomeMovie/HomeMovie";
import './HomePage.css';

export const HomePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.session.user);
    const movies = useSelector((state) => state.movies.allMovies);

    useEffect(() => {
        dispatch(fetchAllMovies());
    }, [dispatch]);

    if (!movies || movies.length === 0) {
        return <p>No movies found. Please add some movies!</p>
    }

    return (
        <div className="all-movies-div">
            {movies.map((movie) => (
                <HomeMovie key={movie.id} movie={movie} />
            ))}
        </div>
    )
}

