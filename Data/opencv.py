import cv2 as cv
import time
from ultralytics import YOLO
import paho.mqtt.client as mqtt

# Cargar el modelo
model = YOLO(r"C:\Users\Isabella\PresArt\runs\detect\train3\weights\best.pt")

# Clases permitidas
clases_permitidas = list(range(9))  # o sea [0, 1, 2, 3, 4, 5, 6, 7, 8]


# URL de la cámara
url = "http://192.168.1.28:81/stream"
cap = cv.VideoCapture(url)

# Tiempo entre frames
frame_delay = 0.1  # en segundos

# MQTT setup
mqtt_client = mqtt.Client()
mqtt_client.connect("3.87.63.131", 1883, 60)

def reconectar():
    global cap
    print("Reconectando a la cámara...")
    cap.release()
    time.sleep(2)  # Espera antes de reconectar
    cap = cv.VideoCapture(url)

while True:
    if not cap.isOpened():
        reconectar()
        continue

    ret, frame = cap.read()

    if not ret or frame is None:
        print("⚠️ No se recibió frame, intentando reconectar...")
        reconectar()
        continue

    # Detección
    results = model(frame)

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            conf = box.conf[0]

            if cls in clases_permitidas:
                class_name = model.names[cls]
                print(f"✅ Detectado: {class_name} ({conf:.2f})")
                
                # Enviar alerta al broker MQTT
                alerta = f"🚨 Objeto detectado: {class_name} ({conf:.2f})"
                mqtt_client.publish("arte/alertas", alerta)

    time.sleep(frame_delay)

# Liberar recursos si alguna vez sales del loop
cap.release()
cv.destroyAllWindows()
mqtt_client.disconnect()
 


