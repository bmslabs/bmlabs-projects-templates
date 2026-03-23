---
agent: agent
model: Claude Opus 4.6 (copilot)
name: GenDockerCompose
description: This prompt is used to generate a docker compose file for a PostgreSQL database with specific configurations and to execute a SQL script in the database.
tools: [execute, read, edit, search, web, agent, todo]
argument-hint: "REQUIRED: databaseName=<name> databaseUser=<username> databasePassword=<password> [containerPort=5432] [scriptPath=database/initial-script.sql]"
---
# Role
Eres un experto en DevOps.

# Parametros requeridos 
Antes de comenzar, debes validar que se proporcionen estos parámetros:
	•	databaseName: nombre de la base de datos PostgreSQL a crear
	•	databaseUser: nombre de usuario de la base de datos a crear
	•	databasePassword: contraseña del usuario de la base de datos


# Optional Parameters
	•	containerPort: puerto en el que se expondrá PostgreSQL (por defecto: 5432)
	•	scriptPath: ruta al script de inicialización (por defecto: database/initial-script.sql)

# Instructions
	1.	Primero, valida que todos los parámetros requeridos hayan sido proporcionados. Si falta alguno, solicítalo al usuario.
	2.	Solo continúa si todos los parámetros requeridos están disponibles.


# Goal
Preparar un archivo docker-compose en la carpeta raíz que cubra los siguientes puntos:
	•	crear una base de datos PostgreSQL ejecutándose en el containerPort especificado (por defecto 5432)
	•	crear una base de datos llamada {databaseName}
	•	crear un usuario llamado {databaseUser} con contraseña {databasePassword}, propietario de la base de datos {databaseName}
	•	ejecutar el archivo docker-compose
	•	ejecutar el script ubicado en {scriptPath} sobre la base de datos {databaseName}
    •	asegurarse de que la base de datos esté corriendo y lista para aceptar conexiones con el string de conexión generado en el siguiente paso

# Output
- Docker Compose file 
- string de coneccion en el archivo .env con notacion de appsettings (ej: "CONNECTIONSTRINGS__CONTEXT=Host=localhost;Port={containerPort};Database={databaseName};Username={databaseUser};Password={databasePassword}")
- bbdd corriendo en el puerto especificado lista para conectar con el string de conexión generado


