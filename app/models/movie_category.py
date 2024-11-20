from .db import db, environment, SCHEMA

# Join Table
class MovieCategory(db.Model):
    __tablename__ = "movie_categories"
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), primary_key=True)

    