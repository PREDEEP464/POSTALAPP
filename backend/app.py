# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from geopy.distance import geodesic
# import json

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # MongoDB setup
# client = MongoClient('mongodb://localhost:27017/')
# db = client['post_office_db']
# collection = db['post_offices']

# def serialize_post_office(post_office):
#     """Convert MongoDB document to serializable format."""
#     post_office['_id'] = str(post_office['_id'])  # Convert ObjectId to string

#     # Handle NaN and Infinity cases
#     for key, value in post_office.items():
#         if isinstance(value, (float, int)) and (value != value or value == float('inf') or value == float('-inf')):
#             post_office[key] = None

#     return post_office

# @app.route('/nearest-post-office', methods=['POST'])
# def nearest_post_office():
#     try:
#         data = request.json
#         if 'latitude' not in data or 'longitude' not in data:
#             return jsonify({'error': 'Latitude and Longitude are required'}), 400

#         user_location = (data['latitude'], data['longitude'])
        
#         # Fetch all post offices
#         post_offices = list(collection.find())
        
#         if not post_offices:
#             return jsonify({'error': 'No post offices found'}), 404
        
#         # Convert each document to a serializable format
#         post_offices = [serialize_post_office(office) for office in post_offices]
        
#         # Calculate distance and find the nearest post office
#         nearest_office = min(post_offices, key=lambda office: geodesic(user_location, (office['latitude'], office['longitude'])).km)
        
#         response_json = jsonify(nearest_office)
#         print(response_json.get_data(as_text=True))  # Print the response to debug
#         return response_json
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from geopy.distance import geodesic
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['post_office_db']
collection = db['post_offices']

def serialize_post_office(post_office):
    """Convert MongoDB document to serializable format."""
    post_office['_id'] = str(post_office['_id'])  # Convert ObjectId to string

    # Handle NaN and Infinity cases
    for key, value in post_office.items():
        if isinstance(value, (float, int)) and (value != value or value == float('inf') or value == float('-inf')):
            post_office[key] = None

    return post_office

@app.route('/post-offices', methods=['GET'])
def get_post_offices():
    try:
        post_offices = list(collection.find())
        post_offices = [serialize_post_office(office) for office in post_offices]
        return jsonify(post_offices)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

@app.route('/nearest-post-office', methods=['POST'])
def nearest_post_office():
    try:
        data = request.json
        if 'latitude' not in data or 'longitude' not in data:
            return jsonify({'error': 'Latitude and Longitude are required'}), 400

        user_location = (data['latitude'], data['longitude'])
        
        # Fetch all post offices
        post_offices = list(collection.find())
        
        if not post_offices:
            return jsonify({'error': 'No post offices found'}), 404
        
        # Convert each document to a serializable format
        post_offices = [serialize_post_office(office) for office in post_offices]
        
        # Calculate distance and find the nearest post office
        nearest_office = min(post_offices, key=lambda office: geodesic(user_location, (office['latitude'], office['longitude'])).km)
        
        return jsonify(nearest_office)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)

