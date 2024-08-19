

```markdown
# Employee Evaluation System

Este proyecto es un sistema de evaluación de empleados, que permite a los administradores y evaluadores gestionar las evaluaciones de los empleados, ver detalles y generar informes.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (versión más reciente)

## Instalación



### 2. Instalar Dependencias

Ejecuta el siguiente comando en el directorio raíz del proyecto para instalar todas las dependencias necesarias para el frontend y backend:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```


## Configuración

### 1. Configuración del Backend

#### Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta del servidor (`/server`) con el siguiente contenido:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/employee-evaluation
JWT_SECRET=tu_jwt_secreto
```

- `MONGO_URI`: La URL de conexión a tu base de datos MongoDB.
- `JWT_SECRET`: Una clave secreta para firmar los tokens JWT (puedes generar una cadena aleatoria).

### 2. Configuración del Frontend

En el directorio `/frontend`, crea un archivo `.env.local` con el siguiente contenido:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Este archivo configura la URL base para las solicitudes del frontend al backend.

## Ejecutar la Aplicación

### 1. Iniciar el Backend

Primero, ejecuta el servidor backend en la carpeta `/backend`:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3001`.

### 2. Iniciar el Frontend

Luego, inicia el frontend en la carpeta `/frontend`:

```bash
npm run dev
```



- **server/**: Contiene el backend (Express + MongoDB).
- **frontend/**: Contiene el frontend (React + Vite).

