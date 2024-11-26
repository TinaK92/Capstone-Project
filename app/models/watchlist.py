from .db import db, environment, SCHEMA

class Watchlist(db.Model):
    __tablename__ = "watchlists"
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="watchlists")
    movies = db.relationship("Movie", secondary='watchlist_movies', back_populates="watchlists")
    watchlist_movies = db.relationship('WatchlistMovie', back_populates='watchlist', cascade="all, delete-orphan")
    


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name
        }
