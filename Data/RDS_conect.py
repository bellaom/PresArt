from fastapi import FastAPI, Request
import mysql.connector
from datetime import datetime 
from fastapi.responses import JSONResponse

app = FastAPI()

db_config = {
    "host": "db-pf.c326emuimr5u.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "cvib1506",
    "database": "dbart"
}

@app.get("/")
def home():
    return {"mensaje": "Servidor funcionando"}


@app.post("/sensor")
async def recibir_datos(request: Request):
    datos = await request.json()

    temperature = datos["temperatura"]
    humidity = datos["humedad"]
    lux =datos["lux"]

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    #editar con el query
    query = "INSERT INTO sensores_data (humedad, temperatura, luminosidad, timestamp) VALUES (%s, %s, %s, %s)"  

    timestamp_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute(query, (humidity, temperature, lux, timestamp_actual))
    
    conn.commit()
    cursor.close()
    conn.close()

    return JSONResponse(content={"mensaje": "Datos guardados"}, status_code=200)