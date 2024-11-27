from .db import db
from .user import User
from .db import environment, SCHEMA
from .movie import Movie
from .watchlist import Watchlist
from .watchlist_movie import WatchlistMovie
from .comment import Comment
from .category import Category
from .movie_category import movie_categories
from .review import Review



all = [
    "User",
    "Movie",
    "Category",
    "MovieCategory",
    "Review",
    "Comment",
    "Watchlist",
    "WatchlistMovie",
]