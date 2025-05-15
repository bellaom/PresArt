import cv2 as cv
from ultralytics import YOLO
import paho.mqtt.client as mqtt
import time
import base64
import numpy as np
from io import BytesIO
from PIL import Image

# --- Configuración ---
broker = 'localhost'
topic_alertas = 'arte/alertas'
topic_frames = 'camara/imagen'
modelo_path = '/home/ubuntu/best.pt'

# --- Inicializar modelo YOLO ---
model = YOLO(modelo_path)

# --- Función para procesar cada frame recibido ---
def on_message(client, userdata, msg):
    if msg.topic == topic_frames:
        try:
            jpg_bytes = base64.b64decode(msg.payload)
            img_array = np.frombuffer(jpg_bytes, dtype=np.uint8)
            frame = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if frame is None:
                print("⚠️ Error al decodificar la imagen")
                return

            cv.imshow("Imagen recibida", frame)
            cv.waitKey(1)

            results = model(frame, verbose=False)[0]
            conteo_clases = {}
            umbral_area = 90000

            for box in results.boxes:
                cls_id = int(box.cls[0])
                class_name = model.names[cls_id]

                x1, y1, x2, y2 = box.xyxy[0]
                ancho = (x2 - x1).cpu().item() if hasattr(x2, 'cpu') else (x2 - x1)
                alto = (y2 - y1).cpu().item() if hasattr(y2, 'cpu') else (y2 - y1)
                area = ancho * alto

                if class_name == "person":
                    if area >= umbral_area:
                        conteo_clases[class_name] = conteo_clases.get(class_name, 0) + 1
                else:
                    conteo_clases[class_name] = conteo_clases.get(class_name, 0) + 1

            for clase, cantidad in conteo_clases.items():
                if clase == "person":
                    mensaje = f"Alerta: {cantidad} persona(s) cerca de la Obra, por favor alejarse"
                else:
                    mensaje = f"Alerta: {cantidad} {clase}(s) detectado(s). Por favor, aléjese de la obra"

                print(f'🚨 {mensaje}')
                mqtt_client.publish(topic_alertas, mensaje)

        except Exception as e:
            print(f"❌ Error procesando imagen: {e}")

# --- Inicializar cliente MQTT ---
mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message
mqtt_client.connect(broker, 1883, 60)
mqtt_client.subscribe(topic_frames)

# --- Bucle principal ---
print("📡 Esperando imágenes por MQTT...")
while True:
    mqtt_client.loop(timeout=1.0)
    time.sleep(0.1)
