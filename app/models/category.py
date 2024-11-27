from .db import db, environment, SCHEMA

class Category(db.Model):
    __tablename__ = "categories"
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(150), nullable=False)

    # Relationships
    movies = db.relationship("MovieCategory", secondary='movie_categories', back_populates="categories", lazy='dynamic')
   
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }