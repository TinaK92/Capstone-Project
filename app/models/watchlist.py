from .db import db, environment, SCHEMA, add_prefix_for_prod

# class Watchlist(db.Model):
#     __tablename__ = "watchlists"
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
#     name = db.Column(db.String(100), nullable=False)

#     # Relationships
#     user = db.relationship("User", back_populates="watchlists")
#     movies = db.relationship(
#         "Movie",
#         secondary=add_prefix_for_prod('watchlist_movies'),
#         primaryjoin=f"{add_prefix_for_prod('watchlists')}.id == {add_prefix_for_prod('watchlist_movies')}.watchlist_id",
#         secondaryjoin=f"{add_prefix_for_prod('movies')}.id == {add_prefix_for_prod('watchlist_movies')}.movie_id",
#         back_populates="watchlists"
#     )
#     # movies = db.relationship("Movie", secondary=add_prefix_for_prod('watchlist_movies'), back_populates="watchlists")

#     watchlist_movies = db.relationship('WatchlistMovie', back_populates='watchlist', cascade="all, delete-orphan")


#     def to_dict(self):
#         return {
#             'id': self.id,
#             'user_id': self.user_id,
#             'name': self.name
#         }


class Watchlist(db.Model):
    __tablename__ = "watchlists"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="watchlists")
    watchlist_movies = db.relationship(
        "WatchlistMovie", back_populates="watchlist", cascade="all, delete-orphan"
    )
    movies = db.relationship(
        "Movie",
        secondary="watchlist_movies",  # Ensure this matches your table name
        back_populates="watchlists",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
        }
