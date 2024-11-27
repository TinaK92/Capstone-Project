from .db import db, environment, SCHEMA, add_prefix_for_prod

# class Movie(db.Model):
#     __tablename__ = "movies"
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.String(2000), nullable=False)
#     release_year = db.Column(db.Integer, nullable=False)
#     image_url = db.Column(db.String(255), nullable=False)
#     created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
#     updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

#     # Relationships:
#     categories = db.relationship(
#         'Category', secondary='movie_categories', back_populates='movies', lazy='dynamic')
#     comments = db.relationship(
#         'Comment', back_populates='movie', cascade="all, delete-orphan"
#     )
#     reviews = db.relationship(
#         'Review', back_populates='movie', cascade="all, delete-orphan"
#     )
#     # watchlists = db.relationship(
#     #     'Watchlist', secondary=add_prefix_for_prod('watchlist_movies'), back_populates='movies'
#     # )
#     watchlists = db.relationship(
#         "Watchlist",
#         secondary=add_prefix_for_prod('watchlist_movies'),
#         primaryjoin=f"{add_prefix_for_prod('movies')}.id == {add_prefix_for_prod('watchlist_movies')}.movie_id",
#         secondaryjoin=f"{add_prefix_for_prod('watchlists')}.id == {add_prefix_for_prod('watchlist_movies')}.watchlist_id",
#         back_populates="movies"
#     )
#     user = db.relationship(
#         'User', back_populates='movies'
#     )
#     watchlist_movies = db.relationship('WatchlistMovie', back_populates='movie')


#     def to_dict(self):
#         return {
#             'id': self.id,
#             'user_id': self.user_id,
#             'name': self.name,
#             'description': self.description,
#             'release_year': self.release_year,
#             'image_url': self.image_url,
#             "created_at": self.created_at,
#             "updated_at": self.updated_at,
#         }


class Movie(db.Model):
    __tablename__ = "movies"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
    )

    # Relationships
    # categories = db.relationship("Category", secondary="movie_categories", back_populates="movies", lazy="dynamic")
    categories = db.relationship(
        "Category",
        secondary="movie_categories",  # Use the model's __tablename__
        back_populates="movies",
    )
    movie_categories = db.relationship(
        "MovieCategory", back_populates="movie", overlaps="categories"
    )
    comments = db.relationship(
        "Comment", back_populates="movie", cascade="all, delete-orphan"
    )
    reviews = db.relationship(
        "Review", back_populates="movie", cascade="all, delete-orphan"
    )
    watchlist_movies = db.relationship(
        "WatchlistMovie", back_populates="movie", cascade="all, delete-orphan"
    )
    user = db.relationship("User", back_populates="movies")
    watchlists = db.relationship(
        "Watchlist",
        secondary="watchlist_movies",  # Ensure this matches your table name
        back_populates="movies",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "release_year": self.release_year,
            "image_url": self.image_url,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
