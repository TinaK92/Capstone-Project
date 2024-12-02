from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text


def undo_watchlists():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()