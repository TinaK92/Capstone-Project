# from .db import db, environment, SCHEMA, add_prefix_for_prod

# class Review(db.Model):
#     __tablename__ = 'reviews'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
#     movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('movies.id')), nullable=False)
#     content = db.Column(db.String(500), nullable=False)

#     # Relationships
#     user = db.relationship("User", back_populates="reviews")
#     movie = db.relationship("Movie", back_populates="reviews")

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'user_id': self.user_id,
#             'movie_id': self.movie_id,
#             'content': self.content,
#         }
