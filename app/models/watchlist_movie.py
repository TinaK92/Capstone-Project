from .db import db, environment, SCHEMA, add_prefix_for_prod
# from sqlalchemy import MetaData

# if environment == "production":
#     myschema = SCHEMA
# else:
#     myschema=None

# metadata_obj = MetaData(schema=myschema)

# watchlist_movies = db.Table(
#     "watchlist_movies",
#     metadata_obj,
#     db.Column("watchlist_id", db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), primary_key=True),
#     db.Column("movie_id", db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
# )


# class WatchlistMovie(db.Model):
#     __tablename__ = "watchlist_movies"
#     if environment == "production":
#         __table_args__ = {"schema": SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), nullable=False)
#     movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('movies.id')), nullable=False)

#     # Relationships
#     watchlist = db.relationship("Watchlist", back_populates="watchlist_movies")
#     movie = db.relationship("Movie", back_populates="watchlist_movies")


class WatchlistMovie(db.Model):
    __tablename__ = "watchlist_movies"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=False, primary_key=True)

    # Relationships
    watchlist = db.relationship('WatchList', back_populates='watchlist_movies')
    movie = db.relationship('Movie', back_populates='watchlist_movies')
    # watchlist = db.relationship("Watchlist", back_populates="watchlist_movies")
    # movie = db.relationship("Movie", back_populates="watchlist_movies")