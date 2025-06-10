import pickle
from flask import Flask, request, jsonify
import logging
import requests
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from psycopg2.extras import Json
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from datetime import datetime
import zoneinfo

from app.functions import notifyUser, getDBURL, get_db_connection, addTask

PLANT_API_KEY = "2b10Vyoiu8f5b4q9bTUri4L4e"
TREFLE_API_KEY = "jixqFbjugs0Nr-ZQd5EKLSwCq20Kd5z14cTc_7Omyjo"
PLANT_IDENTIFY_URL = f"https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key={PLANT_API_KEY}"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# scheduler = BackgroundScheduler()
jobstores = {
    'default': SQLAlchemyJobStore(url=getDBURL())
}
scheduler = BackgroundScheduler(jobstores=jobstores)

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

    @app.route('/api/get_all_plants', methods = ['GET'])
    @jwt_required()
    def dashboard():
        userID = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plants WHERE user_id = %s", (userID,))
        plants = cursor.fetchall()
        conn.close()
        cursor.close()
        return jsonify({"plants":plants}), 200

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
    
    # for reminders/tasks
    @app.route('/api/schedule_task', methods=['POST'])
    @jwt_required()
    def addScheduledTask():
        userID = get_jwt_identity()
        data = request.get_json()
        taskName = data.get("name")
        taskDetails = data.get("details")
        plantID = data.get("plantID")
        if not plantID:
            plantID = -1
        recurring = data.get("recurring")
        if recurring == 'yes':  #shift to cron later
            frequency = data.get("frequency")
            recurring = 'interval'
        else:
            recurring = ''
        types = data.get("types")
        current_time = datetime.now(tz=zoneinfo.ZoneInfo('Asia/Tokyo'))
        current_time = datetime.strptime(current_time.strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        # replace times with cron later
        scheduler.add_job(
            func=addTask,
            trigger=recurring,
            seconds=frequency, #runs every 10 secs
            id= f"{userID} , {taskName}",
            args=[userID, taskName, taskDetails, types, plantID],
            start_date=datetime(current_time.year, current_time.month, current_time.day, current_time.hour, current_time.minute + 2, second=0, tzinfo=zoneinfo.ZoneInfo('Asia/Tokyo')),
            replace_existing=True
        )
        return jsonify({"message":"reminder scheduled"}), 200
    
    @app.route('/api/remove_scheduled_task', methods=['POST'])
    @jwt_required()
    def deleteTask():
        userID = get_jwt_identity()
        data = request.get_json()
        taskName = data.get("name")
        if not taskName:
            return jsonify({"Error: Task Name Required"}),400
        try:
            scheduler.remove_job(f'{userID} , {taskName}')
        except:
            return jsonify({"message":"Error: task not found"}), 404
        return jsonify({"message:":"Task Removed"}), 200
    
    @app.route('/api/get_task_details', methods=['GET'])
    @jwt_required()
    def getTaskDetails():
        userID = get_jwt_identity()
        data = request.get_json()
        taskName = data.get("name")
        task = scheduler.get_job(job_id=f"{userID} , {taskName}")
        if not task:
            return jsonify(), 400
        return jsonify({
            "id": task.id,
            "next_run_time": task.next_run_time.isoformat() if task.next_run_time else None,
            "args": task.args,
            "kwargs": task.kwargs,
            "trigger": str(task.trigger),
        }), 200
        
    @app.route('/api/get_scheduled_tasks', methods=['GET'])
    @jwt_required()
    def getAllScheduledTasks():
        userID = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM apscheduler_jobs WHERE id LIKE %s", (f"{userID} , %",))
        tasks = cursor.fetchall()
        if not tasks:
            return jsonify({"Message":"No tasks"}), 200
        tasks_list = []
        for task in tasks:
            task_dict = {
                "id": task[0],
                "next_run_time": task[1],
                "job_state": pickle.loads(task[2]).get('args')[2],  # Decode if needed
            }
            tasks_list.append(task_dict)
        
        cursor.close()
        conn.close()
        return jsonify(tasks_list), 200
    
    @app.route('/api/remove_task', methods=["POST"])
    @jwt_required()
    def removeCurrentTask():
        data = request.get_json()
        taskID = data.get("task_id")
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE task_id = %s", (taskID,))
        if (cursor.fetchone()):
            cursor.execute("DELETE FROM tasks WHERE task_id = %s", (taskID,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message":"Task Removed"}), 200
        return jsonify({"errorMsg":"No task found"}),400
    
    @app.route('/api/get_current_tasks')
    @jwt_required()
    def getAllCurrentTasks():
        userID = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE user_id = %s", (userID,))
        tasks = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"tasks":tasks}), 200
    
    @app.route('/api/testTime', methods=['GET'])
    def returnTime():
        current_time = datetime.now(tz=zoneinfo.ZoneInfo('Asia/Tokyo'))
        current_time = datetime.strptime(current_time.strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        return jsonify({"time":current_time}), 200
    
    return app

