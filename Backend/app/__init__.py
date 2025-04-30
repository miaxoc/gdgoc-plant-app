from flask import Flask, request, jsonify
import logging
import requests
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import psycopg2
from psycopg2.extras import Json
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from urllib.parse import urlparse
from flask_apscheduler import APScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from datetime import datetime

from app.functions import notifyUser, getDBURL, get_db_connection, addTask

PLANT_API_KEY = "2b10Vyoiu8f5b4q9bTUri4L4e"
TREFLE_API_KEY = "jixqFbjugs0Nr-ZQd5EKLSwCq20Kd5z14cTc_7Omyjo"
PLANT_IDENTIFY_URL = f"https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key={PLANT_API_KEY}"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

scheduler = APScheduler()
scheduler2 = BackgroundScheduler()
jobstores = {
    'default': SQLAlchemyJobStore(url=getDBURL())
}
scheduler2 = BackgroundScheduler(jobstores=jobstores)

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

    @app.route('/', methods =["GET"])
    def homepage():
        return "Hello World"

    @app.route('/api/registration', methods =["POST"])
    def register():
            data = request.get_json()
            username = data.get('username')
            pwd = data.get('pwd')
            device = [data.get('deviceID')]
            email = data.get('email')

            if not username or not pwd or not email:
                return jsonify({"error":"Email, username, and password are required fields"}), 400
            
            if not device[0]:  #for sending notifications
                device = ["N/A"]
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username =%s", (username,))

            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"error": "User exists already"}), 400
            
            hashed_password = bcrypt.generate_password_hash(pwd).decode('utf-8')
            cursor.execute("INSERT INTO users (email, username, password, device_id) VALUES (%s, %s, %s, %s)", (email, username, hashed_password, Json(device)))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "User Registered Successfully"}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        pwd = data.get('pwd')
        email = data.get('email')

        if (not username and not email) or not pwd :
            return jsonify({"error": "Username/Email and Password are required fields"}), 400
        logger.info("working")
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))

        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user or not bcrypt.check_password_hash(user[3],pwd):
            return jsonify({"error": "Invalid Username/Email or Password"}), 401
        
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
    
    @app.route('/api/change_device', methods=['PATCH'])
    @jwt_required
    def changeDeviceID():
        return jsonify({"message":"device changed"}), 200

    @app.route('/api/add_plant', methods=['POST'])
    @jwt_required()
    def add_plant():
        data = request.get_json()
        species = data.get('species')
        plantPhoto = data.get('photo_url')
        errorMsg = ""
        if not species and not plantPhoto:
            errorMsg = "plant name and plant photo ID are required"
        elif not species :
            errorMsg = "plant name is required"
        elif not plantPhoto:
            errorMsg = "plant photo ID is required"
        if not species or not plantPhoto:
            return jsonify ({"error":errorMsg}), 400
        
        userID = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plants WHERE user_id =%s AND species =%s AND images ->> 0 =%s", (userID, species, plantPhoto)) # this will not really work, needs fixing
        
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "plant exists already"}), 400
        
        images = [plantPhoto]    # work on error checking later
        stage = data.get('stage')
        notes = data.get('notes')
        location = data.get('location')
        waterTiming = f"Every {data.get('water_timing')}"
        
        cursor.execute("INSERT INTO plants (user_id, images, species, stage, notes, location, water_timings) VALUES (%s, %s, %s, %s, %s, %s, %s)", (userID, Json(images), species, stage, notes, location, waterTiming))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Plant Registered Successfully"}), 201
    
    @app.route('/api/update_plant', methods=['PATCH'])
    @jwt_required()
    def update_plant():
        return "updated plant"
    
    @app.route('/api/remove_plant', methods=['DELETE'])
    @jwt_required()
    def remove_plant():
        user_id = get_jwt_identity()
        return "removed plant"
    
    # #this doesn't need to exist, just a base if needed
    @app.route('/api/logout', methods=['POST'])
    @jwt_required()
    def logout():
        user_id = get_jwt_identity()
        # add user id to blacklist data table
        return "logged out"
        
    #debug route, send notification to user about plant
    @app.route('/api/send_notif_test', methods=['POST'])
    def notifTest():
        notifyUser()
        return "okay"
    
    # add hours/days to plants table, decrement by 1
    # x < 0 ? notify and reset : no notif
    # this could be used for basic watering/lighting reminders
    # @scheduler.task('interval', id='decrement_column',seconds = 5)
    def notificationTimer():
        print("Timed Update", flush=True)
        logger.info("Timed Update")
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
                    notifyUser(row[4], plantList) # edit notify function for plantList!
                    plantList = []
                plantList.append((row[2],row[0]))
        
        cursor.execute("UPDATE plants SET remind_timer = remind_max_time WHERE remind_timer = 0")
        conn.commit()
        cursor.close()
        conn.close()
    
    # for other reminders
    # @jwt_required
    @app.route('/api/schedule_reminder', methods=['POST'])
    def addNotif():
        # userID = get_jwt_identity()
        data = request.get_json()
        taskName = data.get("name")
        taskDetails = data.get("details")
        plantID = data.get("plantID")
        if not plantID:
            plantID = -1
        recurring = data.get("recurring")
        if recurring == 'yes':
            frequency = data.get("frequency")
            recurring = 'interval'
            print(frequency + " " + recurring, flush=True)
        else:
            recurring = ''
        types = data.get("types")
        scheduler2.add_job(
            func=addTask,
            trigger='interval',
            seconds=10, #runs every 10 secs
            user = 0,
            id=userID + ", " + taskName,
            args=[userID, taskName, taskDetails, types, plantID],
            replace_existing=True
        )
        return jsonify({"message":"reminder scheduled"}), 200
    
    @app.route('/api/remove_reminder', methods=['POST'])
    def deleteReminder():
        try:
            scheduler2.remove_job('testJob')
        except:
            return jsonify({"message":"Error: reminder not found"}), 404
        return jsonify(), 204
    
    return app

