from .db import db, environment, SCHEMA, add_prefix_for_prod


#   JOIN TABLE
class WatchlistMovies(db.Model):
    __tablename__ = "watchlist_movies"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    watchlist_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("watchlists.id")),
        primary_key=True,
    )
    movie_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("movies.id")),
        primary_key=True,
    )

    # Relationships
    watchlist = db.relationship("Watchlist", back_populates="watchlist_movies")
    movie = db.relationship("Movie", back_populates="watchlist_movies")
