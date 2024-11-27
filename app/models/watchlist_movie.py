from .db import db, environment, SCHEMA, add_prefix_for_prod


watchlist_movies = db.Table(
    "watchlist_movies", 
    db.Column("watchlist_id", db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
)

__tablename__ = "watchlist_movies"
if environment == "production":
    __table_args__ = {'schema': SCHEMA}
