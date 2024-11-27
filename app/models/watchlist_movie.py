from .db import db, environment, SCHEMA, add_prefix_for_prod

# Join Table
# class WatchlistMovie(db.Model):
#     __tablename__ = "watchlist_movies"
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}


#     watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), primary_key=True)
#     movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('movies.id')), primary_key=True)

#     movie = db.relationship('Movie', back_populates='watchlist_movies')
#     watchlist = db.relationship('Watchlist', back_populates='watchlist_movies')

watchlist_movies = db.Table(
    "watchlist_movies", 
    db.Column("watchlist_id", db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
)
