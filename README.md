# 📋 Plataforma de Gestión de Tareas Colaborativa

Aplicación web que permite a múltiples usuarios crear, editar, eliminar y colaborar en tareas en tiempo real. Forma parte de una prueba técnica para la vacante de Desarrollador Junior Web.

---

## Despliegue
Puedes ver la aplicación en vivo en https://task-manager-fd03e.web.app/

## 📥 Cómo Descargar y Ejecutar el Proyecto

Sigue estos pasos para clonar, instalar y ejecutar la aplicación en tu entorno local:

### 1️⃣ Clonar el repositorio

`git clone https://github.com/Dev-JimmyZea/task-management.git`

`cd task-management`

### 2️⃣ Instalar dependencias
Este proyecto utiliza Vite + React, así que asegúrate de tener Node.js (v18 o superior) instalado en tu sistema.

Luego de clonar el repositorio, instala las dependencias ejecutando:

`npm install`

### 3️⃣ Ejecutar la aplicación

`npm run dev`

Esto abrirá la aplicación en http://localhost:5173



## 🚀 Tecnologías Utilizadas

### 🧩 Frontend

| Tecnología       | Justificación del uso                                                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| **React.js**     | Porque esta basado en componentes reutilizables. Permite construir una SPA eficiente y modular. Además que ya contaba con experiencia en React. |
| **Tailwind CSS** | Es sencillo de implemetar en este tipo de proyectos y tiene buenda documentacion.                                                               |

### 🔧 Backend

No desarrollé un backend propio, porque no contaba con mucho tiempo de desarrollo. Opté por **Firebase**, que proporciona:

- **Autenticación segura**
- **Base de datos NoSQL con actualizaciones en tiempo real**
- **Reglas de seguridad**
- **Despliegue integrado**

📌 **Justificación**:  
Firebase es una solución serverless integrada y me permitió desarrollar rápidamente una aplicación full-stack funcional con autenticación, persistencia y actualizaciones en tiempo real, sin necesidad de gestionar un backend tradicional.

---

## 🛠️ Base de Datos: Cloud Firestore

Modelo de datos basado en documentos y colecciones.

- Estructura flexible para representar usuarios, tareas e historial de cambios.
- Relaciones uno-a-muchos entre usuarios y tareas (usando IDs y/o subcolecciones).
- **Tiempo real** mediante `onSnapshot()` sin necesidad de WebSockets.

📌 **Justificación**:  
Con firestore se me facilitó la sincronización de datos en tiempo real y pude implementar las reglas de seguridad a nivel de documento.

---

## 🌐 Funcionalidades Clave

✅ Registro e inicio de sesión de usuarios (Firebase Auth)  
✅ Visualización de tareas por usuario  
✅ Creación, edición y eliminación de tareas  
✅ Notificación de cambios en tiempo real con otros usuarios  
✅ Registro de historial de cambios por tarea  
✅ Diseño visual moderno y responsivo  
✅ Sincronización automática en tiempo real (Firestore onSnapshot)

---

## 📂 Estructura del Proyecto

├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public
├── README.md
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Tasks
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskHistoryModal.tsx
│   │   │   └── TaskModal.tsx
│   │   └── types
│   │       └── Task.ts
│   ├── context
│   │   └── AuthContext.tsx
│   ├── helpers
│   │   ├── logTaskChanges.tsx
│   │   └── viewedTasks.tsx
│   ├── hooks
│   ├── index.css
│   ├── lib
│   │   └── firebase.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Tasks.tsx
│   ├── router.tsx
│   ├── styles
│   ├── utils
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

