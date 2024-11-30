from .db import db, environment, SCHEMA, add_prefix_for_prod

# JOIN TABLE
class MovieCategory(db.Model):
    if environment == "production":
    op.execute(f"ALTER TABLE movie_categories SET SCHEMA {SCHEMA};")
    # __tablename__ = "movie_categories"
    # if environment == "production":
    #     __table_args__ = {"schema": SCHEMA}

    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), primary_key=True)

    # Relationships
    movie = db.relationship('Movie', back_populates='movie_categories')
    category = db.relationship('Category', back_populates='movie_categories')
    # movie = db.relationship("Movie", back_populates="movie_categories", overlaps="categories,movies")
    # category = db.relationship("Category", back_populates="movie_categories", overlaps="categories,movies")