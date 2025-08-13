🏨 Sistema de Reservas de Hotel

Este proyecto es un sistema completo para la gestión de reservas de hotel, desarrollado con un backend en Node.js/Express y MongoDB/MySQL y un frontend en Vue.js.  
El sistema permite la gestión de habitaciones, reservas, planes, servicios y usuarios, con control de acceso por roles (Administrador / Usuario).

📌 Características principales
🔹 Backend
-API RESTful desarrollada con Node.js y Express
-Base de datos MongoDB y MySQL
-Control de roles y autenticacion con JWT
-Validaciones con Joi
-Manejo de archivos con Multer
-Seguridad con Helmet, CORS y Rate Limiting
-Registro de logs
-Funciones de administrador
  -Crear, editar y ocultar servicios.
  -Gestion de habitaciones, planes y reservas.
  Administracion de usuarios

🔹 Frontend
-Desarrollado con Vue.js
-Routes con Vue Router.
-Consumo de API con Axios
-Componentes modulares y reutilizables
-Integración con Cypress para pruebas
-Panel de administracion para control total del sistema

📂 Estructura del proyecto
Proyecto/
│
├── Backend/
│ ├── config/ # Configuración de base de datos y entorno
│ ├── controllers/ # Controladores de lógica de negocio
│ ├── middleware/ # Middlewares de seguridad y validaciones
│ ├── models/ # Modelos de datos
│ ├── routes/ # Rutas del API
│ ├── modules/ # Módulos adicionales (logs, etc.)
│ ├── server.js # Configuración e inicio del servidor
│ ├── .env # Variables de entorno
│ └── package.json # Dependencias y scripts del backend
│
├── Frontend/
│ ├── hotel-reservas-frontend/
│ │ ├── public/ # Archivos estáticos
│ │ ├── src/
│ │ │ ├── components/ # Componentes Vue
│ │ │ ├── router/ # Rutas del frontend
│ │ │ ├── services/ # Conexión a la API
│ │ │ ├── views/ # Vistas de páginas
│ │ │ ├── style.css # Estilos globales
│ │ ├── package.json # Dependencias y scripts del frontend
│ │ └── index.html # Entrada principal
│
└── README.md

📦 Backend
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Tinta596/Hotel
   cd Hotel/Backend
2. Instalar dependencias
   npm install
3. Configurar el archivo
   PORT=3000
   JWT_SECRET=ff9a5011c546f832ee9aef4c2accd9c44649a884e1dc2872bff8afefc80fb5f8646e3940f739acef214baea8e64f03fd729e9fe5f2ab69a40aa97092c33799a3
   FRONTEND_URL=http://localhost:5173
4. Iniciar servidor
   npm run dev
FRONTEND
1. Ir al directorio del frontend:
    cd ../Frontend/hotel-reservas-frontend
2. Instalar dependencias:
     npm install
3. Iniciar servidor de desarrollo
     npm run dev

🔑 Endpoints principales (Backend)
| Método | Endpoint             | Descripción                       | Rol requerido |
| ------ | -------------------- | --------------------------------- | ------------- |
| GET    | `/api/habitaciones`  | Lista todas las habitaciones      | Usuario/Admin |
| POST   | `/api/habitaciones`  | Crea una habitación               | Admin         |
| GET    | `/api/reservas`      | Lista reservas del usuario        | Usuario/Admin |
| POST   | `/api/reservas`      | Crea una reserva                  | Usuario/Admin |
| GET    | `/api/planes`        | Lista planes                      | Usuario/Admin |
| POST   | `/api/planes`        | Crea un plan                      | Admin         |
| GET    | `/api/servicios`     | Lista servicios activos           | Usuario/Admin |
| POST   | `/api/servicios`     | Crea un servicio                  | Admin         |
| PUT    | `/api/servicios/:id` | Edita un servicio                 | Admin         |
| PATCH  | `/api/servicios/:id` | Oculta un servicio (activo=false) | Admin         |

🛡️ Roles y permisos
Administrador
  Crear, editar y ocultar servicios.
  Crear, editar y eliminar habitaciones y planes.
  Ver todas las reservas.
Usuario
  Reservar habitaciones.
  Consultar sus reservas.
  Ver habitaciones, servicios y planes.

🧪 Pruebas
  Backend: Postman
  Frontend: Cypress
Ejecutar pruebas frontend:
  npm run test:e2e

Cambios recientes
Versión 1.6.0:
  Se añadió la capacidad para que el administrador pueda crear, editar y ocultar servicios.
  Actualización del control de roles en routes/servicios.js.
  Mejora en la documentación y README.
  Actualización de package.json para reflejar nuevas funcionalidades.

Este proyecto está licenciado bajo la Licencia MIT.

MIT License © 2025 Juan David Barrios Perneth

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y los archivos de documentación asociados (el "Software"), para utilizar el Software sin restricción, incluyendo, sin limitación, los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software que lo hagan, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso deberán incluirse en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES POR NINGÚN RECLAMO, DAÑO U OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN CONTRACTUAL, AGRAVIO O CUALQUIER OTRA FORMA, DERIVADA DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O SU USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
