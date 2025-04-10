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
    get_jwt_identity,
    jwt_required
)
from urllib.parse import urlparse
from flask_apscheduler import APScheduler

PLANT_API_KEY = "2b10Vyoiu8f5b4q9bTUri4L4e"
TREFLE_API_KEY = "jixqFbjugs0Nr-ZQd5EKLSwCq20Kd5z14cTc_7Omyjo"
PLANT_IDENTIFY_URL = f"https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key={PLANT_API_KEY}"
PUSHY_SECRET_KEY = "INSERT KEY HERE"
PUSHY_API_URL = "https://api.pushy.me/push?api_key=" + PUSHY_SECRET_KEY

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

scheduler = APScheduler()

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
    
    scheduler.init_app(app)
    # scheduler.start()
    
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
            device = data.get('deviceID')

            if not username or not pwd :
                return jsonify ({"error":"Username and password are required field"}), 400
            
            if not device:  #for sending notifications
                device = "N/A"
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username =%s", (username,))

            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"error": "User exists already"}), 400
            
            hashed_password = bcrypt.generate_password_hash(pwd).decode('utf-8')
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
            # cursor.execute("INSERT INTO users (username, password, device) VALUES (%s, %s, %s)", (username, hashed_password, device))
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
    
    @app.route('/api/change_password', methods=['PATCH'])
    def changePassword():
        return jsonify({"message": "done"}), 200

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
                "Family": plant_species.get("family", {}).get("scientificName", "Unknown"),
                "Genus": plant_species.get("genus", {}).get("scientificName", "Unknown"),
            }
            return jsonify(plant_info), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    #mainly for debugging purposes
    @app.route('/api/get_identity', methods=['GET'])
    @jwt_required()
    def returnIdentity():
        return jsonify({"identity":get_jwt_identity()}), 200
    
    # @app.route('/api/change_device', methods=['PATCH'])
    # @jwt_required
    # def changeDeviceID():
    #     return jsonify({"message":"device changed"}), 200

    @app.route('/api/add_plant', methods=['POST'])
    @jwt_required()
    def add_plant():
        data = request.get_json()
        species = data.get('species')
        plantPhotoID = data.get('imgID')
        errorMsg = ""
        if not species and not plantPhotoID:
            errorMsg = "plant name and plant photo ID are required"
        elif not species :
            errorMsg = "plant name is required"
        elif not plantPhotoID :
            errorMsg = "plant photo ID is required"
        if not species or not plantPhotoID:
            return jsonify ({"error":errorMsg}), 400
        
        userID = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plants WHERE user_id =%s AND species =%s AND photo_id =%s", (userID, species, plantPhotoID))
        
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "plant exists already"}), 400
        
        time = 24
        cursor.execute("INSERT INTO plants (species, photo_id, user_id, remind_timer, remind_max_time) VALUES (%s, %s, %s, %s, %s)", (species, plantPhotoID, userID, time, time))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Plant Registered Successfully"}), 201
    
    # @app.route('/api/update_plant', methods=['PATCH'])
    # @jwt_required()
    # def update_plant():
    #     return "updated plant"
    
    # @app.route('/api/remove_plant', methods=['DELETE'])
    # @jwt_required()
    # def remove_plant():
    #     user_id = get_jwt_identity()
    #     return "removed plant"
    
    # #this doesn't need to exist, just a base if needed
    # @app.route('/api/logout', methods=['POST'])
    # @jwt_required()
    # def logout():
    #     user_id = get_jwt_identity()
    #     # add user id to blacklist data table
    #     return "logged out"
        
        
    def notifyUser(userID, plantNames):
        #send notification to user about plant
        DEVICE_TOKEN = 0 #get token from table with cursor
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id =%s", (userID,)) #is this correct?
        user = cursor.fetchone()
        if (user[3] == "N/A"):
            return "No Device Attached to User"
        DEVICE_TOKEN = user[3]
        
        notif = {
            "to": DEVICE_TOKEN,
            "data": {
                "message": "Water plants " + ", ".join(plantNames) + "!",
                "title": "Notification Title"
            },
            "notification": {
                "body": "plant notification!",
                "title": "Notification Title"
            }
        }
        
        # below will only work after deployment due to PUSHY.
        # response = requests.post(PUSHY_API_URL, json=notif)
        conn.close()
        cursor.close()
        # if response.status_code == 200:
        print("Notification sent successfully!")
        # else:
            # print("Failed to send notification:", response.text)
        return 0
    
    # add hours/days to plants table, decrement by 1
    # x < 0 ? notify and reset : no notif
    # @app.route('/api/notify_all', methods=['PATCH'])
    @scheduler.task('interval', id='decrement_column',seconds = 5)
    def notificationTimer():
        print("Hello")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("UPDATE plants SET remind_timer = GREATEST(remind_timer - 1, 0)")
        cursor.execute("SELECT * FROM plants WHERE remind_timer = 0 ORDER BY user_id")
        
        rows = cursor.fetchall()
        if len(rows) > 0:
            currentUser = rows[0][4]
            plantList = []
            for row in rows:
                if row[4] != currentUser:
                    #send a reminder for rows 0 through current
                    # notifyUser(row[4], plantList) # edit notify function for plantList!
                    # print(f"reminder sent for user {row[4]}")
                    plantList = []
                plantList.append((row[2],row[0]))
        
        cursor.execute("UPDATE plants SET remind_timer = remind_max_time WHERE remind_timer = 0")
        conn.commit()
        cursor.close()
        conn.close()
        # return jsonify({"message": "Plant Notified Successfully"}), 200
    
    return app

