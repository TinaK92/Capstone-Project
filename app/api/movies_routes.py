from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import Movie, db
from dotenv import load_dotenv
import os
import requests

# Loading my enviorment variables from my .env
load_dotenv()


movie_routes = Blueprint("movies", __name__)

API_READ_ACCESS_TOKEN = os.getenv("API_READ_ACCESS_TOKEN")


@movie_routes.route("/search", methods=["GET"])
def search_movies():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Must provide a movie name"}), 400

    search_url = "https://api.themoviedb.org/3/search/movie"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {os.getenv('API_READ_ACCESS_TOKEN')}",
    }
    params = {
        "query": query,
        "language": "en-US",
        "page": 1,
        "include_adult": False,
    }
    try:
        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()  # Will raise an exception for HTTP errors
        data = response.json()
        return jsonify(data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


# Get All Movies -----------------------------------------
@movie_routes.route("/", methods=["GET"])
def get_all_movies():
    movies = Movie.query.all()
    movie_list = [movie.to_dict() for movie in movies]
    return movie_list


# Get All User Movies
@movie_routes.route("/user/<int:user_id>", methods=["GET"])
def get_user_movies(user_id):
    movies = Movie.query.filter_by(user_id=user_id).all()
    return {"movies": [movie.to_dict() for movie in movies]}


# Get A Movie --------------------------------------------
@movie_routes.route("/<int:id>", methods=["GET"])
def get_movie_details(id):
    movie_details = Movie.query.get(id)
    if movie_details:
        return movie_details.to_dict(), 200
    else:
        return {"error": "Movie not found"}, 404


# Post A New Movie --------------------------------------
@movie_routes.route("/new", methods=["POST"])
@login_required
def create_movie():
    # form['csrf_token'].data = request.cookies['csrf_token']
    data = request.json

    errors = {}
    if not data.get("name"):
        errors["name"] = "Movie name is required"
    if not data.get("description"):
        errors["description"] = "Movie description is required"
    if not data.get("release_year"):
        errors["release_year"] = "Movie release year is required"
    if not data.get("image_url"):
        errors["image_url"] = "Movie image is required"
    if errors:
        return ({"errors": errors}), 400

    new_movie = Movie(
        user_id=current_user.id,
        name=data["name"],
        description=data["description"],
        release_year=data["release_year"],
        image_url=data["image_url"],
    )

    db.session.add(new_movie)
    db.session.commit()
    return (new_movie.to_dict()), 201


# Update A Movie
@movie_routes.route("/<int:id>/edit", methods=["PUT"])
@login_required
def update_movie(id):
    movie = Movie.query.get(id)
    if not movie:
        return {"error": "Movie not found"}, 404
    form = MovieForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        movie.name = form.name.data
        movie.description = form.description.data
        movie.release_year = form.release_year.data

        db.session.commit()
        return movie.to_dict(), 200
    return {"errors": form.errors}, 400


# Delete A Movie
@movie_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_movie(id):
    movie = Movie.query.get(id)
    if not movie:
        return {"error": "Movie not found"}, 404
    if movie.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    db.session.execute(movie)
    db.session.commit()
    return {"message": "Movie has been successfully deleted"}, 200
