from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
# from app.models.watchlist import Watchlist, db
from app.models.watchlist_movie import WatchlistMovie
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
@watchlist_routes.route('/<int:watchlist_id>', methods=["GET"])
@login_required
def get_a_watchlist(watchlist_id):
    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
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
@watchlist_routes.route('/<int:watchlist_id>/movies', methods=["GET"])
@login_required
def get_movies_in_watchlist(watchlist_id):
    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if not watchlist:
        return {"error": "Watchlist not found"}, 404

    # Debugging logs
    print(f"Watchlist ID: {watchlist_id}, Movies: {watchlist.movies}")

    movie_list = [movie.to_dict() for movie in watchlist.movies]
    return jsonify(movie_list), 200

# Add a movie to a watchlist
@watchlist_routes.route('/add_movie_to_watchlist/<int:watchlist_id>', methods=['POST'])
@login_required
def add_movie_to_watchlist(watchlist_id):
    data = request.get_json()
    print(f"Incoming payload: {data}")  # Debugging log
    try:
        data = request.get_json()
        print("Request data:", data)  # Debug log
        movie_id = data.get('movie_id')
        print("Movie ID:", movie_id)  # Debug log

        watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
        if not watchlist:
            print("Watchlist not found")  # Debug log
            return jsonify({"error": "Watchlist not found"}), 404

        movie = Movie.query.get(movie_id)
        if not movie:
            print("Movie not found")  # Debug log
            return jsonify({"error": "Movie not found"}), 404

        if movie in watchlist.movies:
            print("Movie already in watchlist")  # Debug log
            return jsonify({"error": "Movie is already in the watchlist"}), 400

        watchlist.movies.append(movie)
        db.session.commit()

        print("Movie added to watchlist successfully:", movie.to_dict())  # Debug log
        return jsonify(movie.to_dict()), 200

    except Exception as e:
        print("Error in add_movie_to_watchlist:", str(e))  # Debug log
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


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
@watchlist_routes.route('/<int:watchlist_id>/movies/<int:movie_id>', methods=["DELETE"])
@login_required
def delete_movie_from_watchlist(watchlist_id, movie_id):
    """
    Delete a movie from a specific watchlist
    """
    # Validate that the watchlist exists and belongs to the current user
    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if not watchlist:
        return {"error": "Watchlist not found or unauthorized"}, 404

    # Validate that the movie exists in the watchlist
    watchlist_movie = WatchlistMovie.query.filter_by(watchlist_id=watchlist_id, movie_id=movie_id).first()
    if not watchlist_movie:
        return {"error": "Movie not found in this watchlist"}, 404

    try:
        # Delete the movie from the watchlist
        db.session.delete(watchlist_movie)
        db.session.commit()
        return {"message": "Movie successfully removed from watchlist"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"An error occurred: {str(e)}"}, 500

# Delete a Watchlist
@watchlist_routes.route("/<int:watchlist_id>", methods=["DELETE"])
@login_required
def delete_watchlist(watchlist_id):  # Update the parameter name to match the route
    watchlist = Watchlist.query.get(watchlist_id)

    if not watchlist:
        return {"error": "Watchlist not found"}, 404

    if watchlist.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    # Delete the watchlist
    db.session.delete(watchlist)
    db.session.commit()
    return {"message": "Watchlist has been successfully deleted"}, 200


