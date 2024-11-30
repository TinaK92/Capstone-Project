from .db import db, environment, SCHEMA, add_prefix_for_prod

# JOIN TABLE
class MovieCategory(db.Model):
    __tablename__ = add_prefix_for_prod("movie_categories")  # Prefix table name for production schema
    __table_args__ = {'schema': SCHEMA} if environment == "production" else None

    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), primary_key=True)

    # Relationships
    movie = db.relationship('Movie', back_populates='movie_categories')
    category = db.relationship('Category', back_populates='movie_categories')
    # movie = db.relationship("Movie", back_populates="movie_categories", overlaps="categories,movies")
    # category = db.relationship("Category", back_populates="movie_categories", overlaps="categories,movies")