from .db import db, environment, SCHEMA, add_prefix_for_prod

# Join Table
# class MovieCategory(db.Model):
#     __tablename__ = "movie_categories"
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('movies.id')), primary_key=True)
#     category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')), primary_key=True)

#     movies = db.relationship("Movie", back_populates="categories")
#     categories = db.relationship("Category", back_populates="movies")

class MovieCategory(db.Model):
    __tablename__ = '"Movie_categories"'
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), primary_key=True)

    # Relationships
    movie = db.relationship("Movie", back_populates="movie_categories", overlaps="categories,movies")
    category = db.relationship("Category", back_populates="movie_categories", overlaps="categories,movies")