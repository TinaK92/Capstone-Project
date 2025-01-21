from flask import Blueprint, jsonify
from app.models import Category


category_routes = Blueprint('categories', __name__)

@category_routes.route('/all')
def get_all_categories():
    try:
        categories = Category.query.all()
        print(f"Fetched categories: {categories}")  # Debug log
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        print(f"Error fetching categories: {e}")  # Log error
        return {"error": "Failed to fetch categories"}, 500