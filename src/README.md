Sistema de Gestión y Monitoreo de Servidores
Nombre oficial del proyecto: Infracore

Resumen del problema o necesidad identificada

Las organizaciones que administran infraestructura tecnológica requieren un control centralizado de sus servidores para garantizar disponibilidad, rendimiento y seguridad.

En muchos entornos, la información de los servidores se encuentra dispersa o se gestiona manualmente, lo que genera:
• Falta de visibilidad del estado de los servidores
• Dificultad para detectar fallos o incidentes a tiempo
• Escasa trazabilidad de alertas y eventos
• Baja eficiencia en la toma de decisiones

Este proyecto busca solucionar esta problemática mediante una plataforma web que centraliza la información y permite monitoreo en tiempo real.

Proceso de ideación

El proyecto se desarrolló siguiendo un enfoque incremental:

1. Identificación del problema en la gestión de infraestructura.
2. Definición de un sistema centralizado tipo dashboard.
3. Diseño de módulos principales:
   o Gestión de servidores
   o Alertas y monitoreo
   o Usuarios y roles
4. Selección de arquitectura web.
5. Desarrollo de interfaz web dinámica.
   📋 Levantamiento de requerimientos
   🔹 Requerimientos funcionales
   • Registro, edición y eliminación de servidores
   • Visualización de inventario de servidores
   • Consulta de KPIs generales (activos, inactivos, total)
   • Gestión de usuarios y roles
   • Visualización de alertas del sistema
   • Autenticación y control de acceso
   🔹 Requerimientos no funcionales
   • Interfaz web responsiva
   • Arquitectura modular (frontend/backend separado)
   • Acceso seguro mediante login
   • Tiempo de respuesta eficiente en consultas
   • Escalabilidad para nuevos módulos
   Aplicación de UML y actores encontrados
   Actores del sistema
   • Administrador: gestiona usuarios, servidores y configuración general
   • Técnico: monitorea servidores y revisa alertas
   • Auditor: visualización de módulos solo lectura
   Diagramas UML aplicados
   Diagrama de casos de uso:
   o Gestión de servidores
   o Gestión de alertas
   o Autenticación de usuarios
   Funcionalidades implementadas
   Frontend (React + CoreUI)
   • Dashboard Principal
   • Tabla de servidores con listado dinámico
   • Gestión de usuarios
   • Visualización de alertas
   • Control de sesión (login/logout)
   🛠️ Backend (Node.js + Express)
   • Express.js: El framework del backend encargado de exponer la API RESTful. Es el que procesa las solicitudes HTTP, gestiona el inicio de sesión y responde con los datos que interceptamos en el frontend.
   • Node.js: Entorno de ejecución en el servidor que soporta toda tu infraestructura de desarrollo.
   • Manejo de usuarios y autenticación
   • Rutas estructuradas por módulos
   • Integración con base de datos MySQL
   🗄️ Base de datos (MySQL)
   Tablas principales:
   • servidores
   • usuarios
   • roles
   • alertas
   • tipos_alerta
   • severidades
   • estados_alerta
   🧰 Tecnologías utilizadas
   Frontend
   • React.js
   • CoreUI
   • Axios
   • SweetAlert2
   • CSS personalizado
   Backend
   • Node.js
   • Express.js
   • MySQL
   • JWT (autenticación, si aplica)
   Base de datos
   • MySQL
   Herramientas adicionales
   • Git / GitHub
   • Postman (pruebas API)
   Resumen general del desarrollo del proyecto
   El sistema fue desarrollado bajo una arquitectura cliente-servidor separada, donde el frontend consume una API REST construida en Node.js.
   Se implementó un dashboard central que permite visualizar KPIs en tiempo real, así como módulos de administración para servidores, usuarios y alertas.
   Durante el desarrollo se resolvieron problemas como:
   • Manejo de datos vacíos en consultas SQL
   • Integración entre CoreUI y React Router
   • Control de sesión y redirección en login/logout
   • Estructuración de endpoints REST
   El resultado es una plataforma funcional, escalable y modular que puede ampliarse para incluir monitoreo en tiempo real o integración con herramientas externas de infraestructura.
