import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchAllMovies } from "../../redux/movie";
import { fetchAllCategories } from "../../redux/category";
import HomeMovie from "../HomeMovie/HomeMovie";
import "./HomePage.css";

export const HomePage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const categories = useSelector((state) => state.categories.categories);
    const movies = useSelector((state) => state.movies.allMovies);
  
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    useEffect(() => {
      dispatch(fetchAllCategories());
      dispatch(fetchAllMovies());
    }, [dispatch]);
  
    const handleCategory = (category) => {
      console.log("Clicked category:", category);
      setSelectedCategory((prevCategory) =>
        prevCategory?.id === category.id ? null : category
      );
    };

    useEffect(() => {
        if (location.pathname === "/") {
          setSelectedCategory(null);
        }
      }, [location]);
  
    const filterMoviesByCategory = (movies, selectedCategory) => {
      if (selectedCategory) {
        return movies.filter((movie) =>
          movie.categories.includes(selectedCategory.name)
        );
      }
      return movies;
    };
  
    const filteredMovies = filterMoviesByCategory(movies, selectedCategory);
  
    useEffect(() => {
      console.log("Movies:", movies);
      console.log("Categories:", categories);
      console.log("Filtered Movies:", filteredMovies);
    }, [movies, categories, filteredMovies]);
  
    if (!movies || movies.length === 0) {
      return <p className="message">No movies found. Please add some movies!</p>;
    }
  
    return (
      <div className="home-page-wrapper">
        <div className="category-container">
          {categories &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategory(category)}
                className={`category ${
                  selectedCategory?.id === category.id ? "selected" : ""
                }`}
              >
                {category.name}
              </button>
            ))}
        </div>
        <div className="all-movies-div">
          {filteredMovies.map((movie) => (
            <HomeMovie key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  };
  
  export default HomePage;