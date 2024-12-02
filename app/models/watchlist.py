from .db import db, environment, SCHEMA, add_prefix_for_prod


class Watchlist(db.Model):
    __tablename__ = "watchlists"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String(100), nullable=False, unique=True)

    # Relationships:
    user = db.relationship("User", back_populates="watchlists")
    watchlist_movies = db.relationship(
        "WatchlistMovie",
        back_populates="watchlist",
        cascade="all, delete-orphan",
        overlaps="movies",
    )
    movies = db.relationship(
        "Movie",
        secondary="watchlist_movies",
        back_populates="watchlists",
        overlaps="watchlist_movies",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
        }
