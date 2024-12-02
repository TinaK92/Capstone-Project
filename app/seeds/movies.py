from app.models import db, Movie, environment, SCHEMA
from sqlalchemy.sql import text


def undo_movies():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.movies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM movies"))

    db.session.commit()