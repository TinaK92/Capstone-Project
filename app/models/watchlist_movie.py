from .db import db, environment, SCHEMA

# Join Table
class WatchlistMovie(db.Model):
    __tablename__ = "watchlist_movies"
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    watchlist_id = db.Column(db.Integer, db.ForeignKey('watchlists.id'), primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)

