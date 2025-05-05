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
            # Decodificar base64 -> bytes
            jpg_bytes = base64.b64decode(msg.payload)
            
            # Convertir JPEG a imagen OpenCV
            img_array = np.frombuffer(jpg_bytes, dtype=np.uint8)
            frame = cv.imdecode(img_array, cv.IMREAD_COLOR)

            if frame is None:
                print("⚠️ Error al decodificar la imagen")
                return

              # ✅ Mostrar la imagen para prueba
            cv.imshow("Imagen recibida", frame)
            cv.waitKey(1)
            
            # Procesar con YOLO
            results = model(frame, verbose=False)[0]
            conteo_clases = {}
            for result in results.boxes.data.tolist():
                _, _, _, _, conf, cls_id = result
                cls_id = int(cls_id)
                class_name = model.names[cls_id]
                # Incrementar contador de esta clase
                if class_name in conteo_clases:
                    conteo_clases[class_name] += 1
                else:
                    conteo_clases[class_name] = 1
            for clase, cantidad in conteo_clases.items():
                mensaje = f'Alerta: {clase} detectado {cantidad} vez/veces'
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

