import os
from urllib.parse import urlparse
import psycopg2
from psycopg2.extras import Json


PUSHY_SECRET_KEY = "INSERT KEY HERE"
PUSHY_API_URL = "https://api.pushy.me/push?api_key=" + PUSHY_SECRET_KEY


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

def getDBURL():
    return os.environ.get('DATABASE_URL')

def addTask(userID, taskName, taskDetails, taskTypes, plant_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    # cursor.execute("INSERT INTO tasks (user_id, name, details, types) VALUES (%s, %s, %s, %s)", (userID, taskName, taskDetails, Json(taskTypes)))
    print(userID + " " + taskName + " " + taskDetails)
    conn.close()
    cursor.close()

def notifyUser(userID=1, plantNames="test"):
    print(f"NOTIF {userID}" + " " + plantNames, flush=True)
    DEVICE_TOKEN = 0 #get token from table with cursor
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id =%s", (userID,)) #is this correct?
    user = cursor.fetchone()
    if (user[3] == "N/A"):
        print("No Devices", flush=True)
        return "No Device Attached to User"
    print(f"device: {DEVICE_TOKEN}", flush=True)
    DEVICE_TOKEN = user[3]
    
    sendNotif(DEVICE_TOKEN, "Water plants " + ", ".join(plantNames) + "!")
    
    conn.close()
    cursor.close()
    # print("Notification sent successfully! "+notif["data"]["message"], flush=True)
    return "okay"

def sendNotif(deviceID, message):
    notif = {
        "to": deviceID,
        "data": {
            "message": message,
            "title": "Notification Title"
        },
        "notification": {
            "body": "plant notification!",
            "title": "Notification Title"
        }
    }
    # response = requests.post(PUSHY_API_URL, json=notif)
    