from flask_wtf import FlaskForm
from wtforms import StringField
from app.models import Watchlist
from wtforms.validators import DataRequired

class CreateWatchlistForm(FlaskForm):
    name = StringField('Watchlist Name', validators=[DataRequired()])