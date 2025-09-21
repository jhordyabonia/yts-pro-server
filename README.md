
<p align="center">
Used [pnpm](https://pnpm.io/installation) to typescript
</p>

## Features


- POST /tasks: Crear una nueva tarea. La tarea debe tener al menos los siguientes campos:
- title (string, requerido)
- description (string, opcional)
- status (string, por defecto 'pending')
- assigned_to (string, opcional)
- due_date (date, opcional)
- GET /tasks: Obtener todas las tareas.
- GET /tasks/{id}: Obtener una tarea específica por su ID.
- PUT /tasks/{id}: Actualizar completamente una tarea por su ID.
- PATCH /tasks/{id}: Actualizar parcialmente una tarea (por ejemplo, solo el estado).
- DELETE /tasks/{id}: Eliminar una tarea por su ID.
- GET /tasks/status/{status}: Obtener todas las tareas con un estado específico (ej. 'pending', 'in_progress', 'completed').
- Manejo de tareas asíncronas: Implementar un sistema para manejar trabajos asíncronos que:
- Permita programar tareas que deben ejecutarse en el futuro (por ejemplo, enviar una notificación cuando se acerque la due_date de una tarea).
- Gestione tareas que puedan tomar un tiempo prolongado (por ejemplo, procesar un informe de tareas completadas).
- Utilice una cola de trabajos (como SQS, RabbitMQ, BullMQ) para manejar estas operaciones asíncronas de manera eficiente y escalable.
- Proporcione un endpoint (ej. POST /tasks/{id}/schedule) para programar un trabajo asíncrono relacionado con una tarea específica.
 

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up your environment variables in a `.env` file:
   ```
   REDIS_HOST="redis-your-redis-server"
   REDIS_PORT=your-redis-port
   REDIS_TASK_QUEUE="task-queue"
   MONGODB_NAME="mogodb-name"
   MONGODB_PORT=mogodb-server-port
   MONGODB_URL="mongodb://your-mogodb-server-url"
   ```
4. Run the development server:
   ```
   pnpm run dev
   ```

### Using Docker (Recommended)

This project includes a Dockerfile for easy deployment and consistent environments. To use Docker:

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Build Project:
   ```
   pnpm run build
   ```
4. Build the Docker image:
   ```
   docker build -t tasks .
   ```
5. Run the containers:
   ```
   docker compose -f tasks-stack.yml up -d
   ```
6. Open Navegator:
   ```
   http://localhost:3008/tasks
   ```

This method ensures that the application runs in a consistent environment across different systems.

## Usage

- #### POST /tasks:
   payload:
   <pre>
      {
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
      }    
   </pre>
   result:
   <pre>
   {
      "status":"ok",
      "data":1
   }
   </pre>

   error:
   <pre>
   {
      "status":"error",
      "data": {
         "code": 11000,
         "errmsg": "E11000 duplicate key error collection: jiraCBW.tasks index: _id_ dup key: { _id: 1 }",        
      }
   }
   </pre>

- #### GET /tasks:
   result:
   <pre>
   {
      "status":"ok",
      "data":[
         {
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
         },
         ...
      ]
   }
   </pre>

- #### GET /tasks/status/:status:     [pending,in_progress,completed]
   result:
   <pre>
   {
      "status":"ok",
      "data":[
         {
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
         },
         ...
      ]
   }
   </pre>

- #### GET /tasks/1: 
   result:
    <pre>
   {
      "status":"ok",
      "data":{
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
      }     
   }
   </pre>

- #### PUT /tasks/1
   payload:
   <pre>
      {
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
      }      
   </pre>
   result:
   <pre>
   {
      "status":"ok",
      "data":
      {
         "_id": 1,
         "title": "tasks",
         "status": "pending",
         "priority": 1,
         "description": "task 1",
         "created_date": "06-08-2025",
         "due_date": "06-09-2025",
         "assigned_to": "jhon@doe.cl",
         "author"jhon@doe.cl",
         "project_id": 1,
         "tags": [],
         "permissions": []
      }      
   }
    </pre>

- #### PATCH /tasks/1:
   payload:
  <pre>
      {
         "title": "tasks (edited)"
      }  
   </pre>
   result:
   <pre>
   {
      "status":"ok",
      "data": {
            "_id": 1,
            "title": "tasks",
            "status": "pending",
            "priority": 1,
            "description": "task 1",
            "created_date": "06-08-2025",
            "due_date": "06-09-2025",
            "assigned_to": "jhon@doe.cl",
            "author"jhon@doe.cl",
            "project_id": 1,
            "tags": [],
            "permissions": []
         }  
   }
    </pre>

- #### DELETE /tasks/1:
   result:
   <pre>
   {
      "status":"ok",
      "data":1
   }  
   </pre>

- #### POST /tasks/1/schedule:
   payload:
  <pre>
      {
         "due_date": "08-09-2025"
         "message": 1
      }  
   </pre>
   result:
   <pre>
   {
      "status":"ok",
      "data": "Recordatorio para la tarea 1 programado."
   }
   </pre>
   error:
   <pre>
   {
      "status":"error",
      "data": "La due_date debe ser en el futuro."
   }
   </pre>
## Documentation

