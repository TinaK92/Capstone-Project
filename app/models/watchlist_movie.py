from .db import db, environment, SCHEMA, add_prefix_for_prod

#   JOIN TABLE
class WatchlistMovie(db.Model):
    __tablename__ = add_prefix_for_prod("watchlist_movies")  # Prefix table name for production schema
    __table_args__ = {'schema': SCHEMA} if environment == "production" else None

    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=False, primary_key=True)

    # Relationships
    watchlist = db.relationship('Watchlist', back_populates='watchlist_movies', overlaps="movies")
    movie = db.relationship('Movie', back_populates='watchlist_movies', overlaps="watchlists"
    )
