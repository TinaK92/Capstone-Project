from .db import db, environment, SCHEMA, add_prefix_for_prod
from .movie_category import movie_categories

class Category(db.Model):
    __tablename__ = 'categories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)


    # Relationships
    movies = db.relationship('Movie', secondary=movie_categories, back_populates='categories')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }