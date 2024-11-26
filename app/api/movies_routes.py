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
    return jsonify(movie_list)


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
    
# Check if a Movie Exists
@movie_routes.route("/exists", methods=["GET"])
def check_movie_exists():
    name = request.args.get("name")
    release_year = request.args.get("release_year")

    if not name or not release_year:
        return {"error": "Missing parameters"}, 400

    existing_movie = Movie.query.filter_by(name=name, release_year=release_year).first()
    if existing_movie:
        return {"exists": True}, 200
    else:
        return {"exists": False}, 200


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
        return jsonify({"errors": errors}), 400
    
    existing_movie = Movie.query.filter_by(name=data["name"], release_year=data["release_year"]).first()
    if existing_movie:
        return jsonify({"error": "This movie has already been added to the database."}), 400


    new_movie = Movie(
        user_id=current_user.id,
        name=data["name"],
        description=data["description"],
        release_year=data["release_year"],
        image_url=data["image_url"],
    )

    db.session.add(new_movie)
    db.session.commit()
    return jsonify(new_movie.to_dict()), 201


# Update A Movie
@movie_routes.route("/<int:movie_id>/edit", methods=["PUT"])
@login_required
def update_movie(movie_id):
    # Get the movie from the database
    movie = Movie.query.get(movie_id)

    if not movie:
        return {"error": "Movie not found"}, 404

    # Check if the current user is the owner of the movie
    if movie.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    # Parse the request JSON for the description
    data = request.get_json()
    description = data.get("description")

    if not description or not description.strip():
        return {"error": "Description cannot be empty"}, 400

    # Update the description and save to the database
    movie.description = description
    db.session.commit()

    return movie.to_dict(), 200


# Delete A Movie
@movie_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_movie(id):
    movie = Movie.query.get(id)
    if not movie:
        return {"error": "Movie not found"}, 404
    if movie.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    db.session.delete(movie)
    db.session.commit()
    return {"message": "Movie has been successfully deleted"}, 200
