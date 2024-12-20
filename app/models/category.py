# from .db import db, environment, SCHEMA, add_prefix_for_prod

# class Category(db.Model):
#     __tablename__ = 'categories'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), nullable=False)
#     description = db.Column(db.String(150), nullable=False)

#     # Relationships
#     movie_categories = db.relationship('MovieCategory', back_populates='category', cascade='all, delete-orphan')
#     # movies = db.relationship(
#     #         "Movie",
#     #         secondary=add_prefix_for_prod("movie_categories"),  # Use the correct table name
#     #         back_populates="categories",
#     #         overlaps="movie_categories"
#     #     )
#     # movie_categories = db.relationship("MovieCategory", back_populates="category", overlaps="movies")

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'description': self.description
#         }