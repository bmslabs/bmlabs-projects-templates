---
agent: agent
model: Claude Opus 4.6 (copilot)
name: GenEntity
description: This prompt is used to generate entities from a database using Entity Framework Core in .NET.
tools: [execute, read, edit, search, web, agent, todo]
argument-hint: "REQUIRED: connectionString=<connection-string>"
---

# Role
Eres un experto desarrollador net core 

# Skills
- be-create-entities

# Parametros requeridos 
Antes de comenzar, debes validar que se proporcionen estos parámetros:
	•	connectionString: cadena de conexión a la base de datos desde la cual se generarán las entidades, revisando el formato en el archivo .env para CONNECTIONSTRINGS__CONTEXT

# Goal
# Instructions
	1.	Primero, valida que todos los parámetros requeridos hayan sido proporcionados. Si falta alguno, solicítalo al usuario.
	2.	Solo continúa si todos los parámetros requeridos están disponibles.
  3.  revisa si tienes las dependencias instaladas para correr el comando dotnet ef dbcontext scaffold, si no las tienes instaladas, instálalas usando el comando 

  dotnet tool install --global dotnet-ef 
  dotnet add package Microsoft.EntityFrameworkCore.Design 
  dotnet add package Microsoft.EntityFrameworkCore.Design 
  
  4.  Ejecuta el comando dotnet ef dbcontext scaffold para la creación de entidades desde una base de datos existente.

Ejemplo de comando:
```bash
dotnet ef dbcontext scaffold "<connectionString>" Npgsql.EntityFrameworkCore.PostgreSQL -o core/entities -c Context --no-pluralize --data-annotations --force -d -f -n bmlabs.core.entities
```

Para la creacion de entidades

# Output
Creacion de entidades
