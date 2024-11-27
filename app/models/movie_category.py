from .db import db, environment, SCHEMA, add_prefix_for_prod

# Join Table
# class MovieCategory(db.Model):
#     __tablename__ = "movie_categories"
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     movie_id = db.Column("movie_id",db.Integer, db.ForeignKey(add_prefix_for_prod('movies.id')), primary_key=True)
#     category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')), primary_key=True)

#     # movies = db.relationship("Movie", back_populates="categories")
#     # categories = db.relationship("Category", back_populates="movies")


  movie_categories = db.Table(
    "movie_categories",
     db.Column("movie_id", db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True),
     db.Column("category_id", db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), primary_key=True)
  )

    __tablename__ = "movie_categories"
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}