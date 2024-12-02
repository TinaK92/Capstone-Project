from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import delete

# from app.models.watchlist import Watchlist, db
from app.models.watchlist_movie import watchlist_movies
from dotenv import load_dotenv
from app.forms.create_watchlist_form import CreateWatchlistForm
from app.models import Watchlist, Movie, db

load_dotenv()

watchlist_routes = Blueprint("watchlist", __name__)


# Get All Watchlist
@watchlist_routes.route("/", methods=["GET"])
@login_required
def get_watchlists():
    watchlists = Watchlist.query.all()
    watchlist_list = [watchlists.to_dict() for watchlist in watchlists]
    return jsonify(watchlist_list)


# Get A Watchlist
@watchlist_routes.route("/<int:watchlist_id>", methods=["GET"])
@login_required
def get_a_watchlist(watchlist_id):
    watchlist = Watchlist.query.filter_by(
        id=watchlist_id, user_id=current_user.id
    ).first()
    if not watchlist:
        return {"error": "Watchlist not found or unauthorized"}, 404
    return watchlist.to_dict()  # Ensure this returns valid JSON


# Get All My Watchlist
@watchlist_routes.route("/users/<int:user_id>", methods=["GET"])
@login_required
def get_my_watchlists(user_id):
    if user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    user_watchlists = Watchlist.query.filter_by(user_id=user_id).all()
    watchlist_list = [watchlist.to_dict() for watchlist in user_watchlists]
    return jsonify(watchlist_list), 200


# Get all users watchlists route


# Get All Movies in a Watchlist
@watchlist_routes.route("/<int:watchlist_id>/movies", methods=["GET"])
@login_required
def get_movies_in_watchlist(watchlist_id):
    watchlist = Watchlist.query.filter_by(
        id=watchlist_id, user_id=current_user.id
    ).first()
    if not watchlist:
        return {"error": "Watchlist not found"}, 404

    # Debugging logs
    print(f"Watchlist ID: {watchlist_id}, Movies: {watchlist.movies}")

    movie_list = [movie.to_dict() for movie in watchlist.movies]
    return jsonify(movie_list), 200


# Add a movie to a watchlist
@watchlist_routes.route("/<int:watchlist_id>/add", methods=["POST"])
@login_required
def add_movie_to_watchlist(watchlist_id):
    data = request.get_json()
    movie_id = data.get("movie_id")

    # Check if the watchlist exists and belongs to the current user
    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if not watchlist:
        return {"error": "Watchlist not found"}, 404

    # Check if the movie exists
    movie = Movie.query.get(movie_id)
    if not movie:
        return {"error": "Movie not found"}, 404

    # Check if the movie is already in the watchlist
    existing_entry = db.session.execute(
        watchlist_movies.select().where(
            (watchlist_movies.c.watchlist_id == watchlist_id) &
            (watchlist_movies.c.movie_id == movie_id)
        )
    ).fetchone()

    if existing_entry:
        return {"error": "Movie is already in the watchlist"}, 400

    # Add the movie to the watchlist
    insert_statement = insert(watchlist_movies).values(
        watchlist_id=watchlist_id,
        movie_id=movie_id
    )
    db.session.execute(insert_statement)
    db.session.commit()

    return {"message": "Movie added to watchlist"}, 201


# Create a WatchList
@watchlist_routes.route("/create_new_watchlist", methods=["POST"])
@login_required
def create_new_watchlist():
    form = CreateWatchlistForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        try:
            new_watchlist = Watchlist(
                user_id=current_user.id,
                name=form.data["name"],
            )
            db.session.add(new_watchlist)
            db.session.commit()
            return (new_watchlist.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return ({"errors": "An error occured while creating the watchlist."}), 500
    else:
        return ({"errors": form.errors}), 400


# Remove a movie from a watchlist
@watchlist_routes.route("/<int:watchlist_id>/movies/<int:movie_id>/delete", methods=["DELETE"])
@login_required
def delete_movie_from_watchlist(watchlist_id, movie_id):
    """
    Delete a movie from a specific watchlist
    """
    # Validate that the watchlist exists and belongs to the current user
    watchlist = Watchlist.query.filter_by(
        id=watchlist_id, user_id=current_user.id
    ).first()
    if not watchlist:
        return {"error": "Watchlist not found or unauthorized"}, 404

    try:
        # Validate that the movie exists in the watchlist and delete it
        delete_statement = delete(watchlist_movies).where(
            (watchlist_movies.c.watchlist_id == watchlist_id) &
            (watchlist_movies.c.movie_id == movie_id)
        )
        result = db.session.execute(delete_statement)

        if result.rowcount == 0:
            return {"error": "Movie not found in this watchlist"}, 404

        db.session.commit()
        return {"message": "Movie successfully removed from watchlist"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"An error occurred: {str(e)}"}, 500


# Delete a Watchlist
@watchlist_routes.route("/<int:watchlist_id>/delete", methods=["DELETE"])
@login_required
def delete_watchlist(watchlist_id):
    """
    Delete a specific watchlist belonging to the current user.
    """
    try:
        # Validate that the watchlist exists and belongs to the current user
        watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
        
        if not watchlist:
            return {"error": "Watchlist not found or unauthorized"}, 404

        # Optionally: Clean up any relationships (if cascade delete is not set in your model)
        db.session.execute(
            watchlist_movies.delete().where(
                watchlist_movies.c.watchlist_id == watchlist_id
            )
        )

        # Delete the watchlist
        db.session.delete(watchlist)
        db.session.commit()
        
        return {"message": "Watchlist has been successfully deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"An error occurred: {str(e)}"}, 500