from flask import Flask, request, jsonify
import logging
import requests
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import psycopg2
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
)
from urllib.parse import urlparse

PLANT_API_KEY = "2b10Vyoiu8f5b4q9bTUri4L4e"
TREFLE_API_KEY = "jixqFbjugs0Nr-ZQd5EKLSwCq20Kd5z14cTc_7Omyjo"
PLANT_IDENTIFY_URL = f"https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key={PLANT_API_KEY}"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def create_app():
    app = Flask("__main__")
    app.config["JWT_SECRET_KEY"] = "eblgQsPQXhOLIhPlaTsm6eSXk8jqyKUg"

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    bcrypt = Bcrypt(app)
    CORS(app)
    jwt = JWTManager(app)
    """def get_db_connection():
        connection = psycopg2.connect(
            dbname = "userInfo",
            user = "gdg",
            password = "GDGPlantApp",
            host = "localhost",
            port = 5433
    )
        return connection"""
    
    def get_db_connection():
        database_url = os.environ.get('DATABASE_URL')

        result = urlparse(database_url)

        connection = psycopg2.connect(
            dbname=result.path[1:], 
            user=result.username,
            password=result.password,
            host=result.hostname,
            port=result.port
        )
        return connection

    @app.route('/', methods =["GET"])
    def homepage():
        return "Hello World"

    @app.route('/api/registration', methods =["POST"])
    def register():
            data = request.get_json()
            username = data.get('username')
            pwd = data.get('pwd')

            if not username or not pwd :
                return jsonify ({"error":"Username and password are required field"}), 400
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username =%s", (username,))

            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"error": "User exists already"}), 400
            
            hashed_password = bcrypt.generate_password_hash(pwd).decode('utf-8')
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "User Registered Successfully"}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        pwd = data.get('pwd')

        if not username or not pwd :
            return jsonify({"error": "Username and Password are required fields"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user or not bcrypt.check_password_hash(user[2],pwd):
            return jsonify({"error": "Invalid Username or Password"}), 401
        
        token = create_access_token(identity=str(user[0]))
        return jsonify({"access_token": token}), 200

    @app.route('/api/dashboard', methods = ['GET'])
    @jwt_required()
    def dashboard():
        return jsonify({"message":"Successful Login"}), 200

    @app.route('/api/speciesIdentifier', methods=['POST'])
    @jwt_required()
    def image_recognition():
        if "image" not in request.files:
            return jsonify({"error":"No image uploaded"}),400

        try:
            image = request.files["image"]
            image_path = os.path.join(UPLOAD_FOLDER, image.filename)
            image.save(image_path)

            with open(image_path, "rb") as img:
                files = {"images":(image.filename, img, image.content_type)}
                headers= {"accept": "application/json"}
                response = requests.post(PLANT_IDENTIFY_URL, headers=headers, files=files)
            
            os.remove(image_path)
            plant_details = response.json()
            """plant_species = plant_details["results"][0]["species"]["scientificNameWithoutAuthor"]
            return jsonify(plant_species)"""
            logger.info(f'{plant_details}')
            plant_results= plant_details["results"][0]
            plant_species = plant_results["species"]
            plant_info={
                "Scientific Name": plant_species.get("scientificNameWithoutAuthor", "Unknown"),
                "Common Name": (plant_species.get("commonNames") or ["Unknown"])[0],
                "Family": plant_species.get("family", {}).get("scientificName", "Unkown"),
                "Genus": plant_species.get("genus", {}).get("scientificName", "Unkown"),
            }
            return jsonify(plant_info), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

        
    return app






    
