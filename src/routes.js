import React from 'react'

// PÁGINAS PÚBLICAS O DE AUTENTICACIÓN
const Login = React.lazy(() => import('./views/pages/login/Login'))
const RequestAccess = React.lazy(() => import('./views/pages/requestAccess/RequestAccess'))

// DASHBOARD
const DashboardAdmin = React.lazy(() => import('./views/dashboard/DashboardAdmin'))

// INVENTARIO DE SERVIDORES
const Table = React.lazy(() => import('./views/servidores/Table'))
const Register = React.lazy(() => import('./views/servidores/Register'))

// GESTIÓN DE USUARIOS
const Users = React.lazy(() => import('./views/users/Users'))
const Roles = React.lazy(() => import('./views/users/Roles'))
const AccessReq = React.lazy(() => import('./views/users/AccessReq'))
const CreateUser = React.lazy(() => import('./views/users/CreateUser'))

// MONITOREO
const AlertsDashboard = React.lazy(() => import('./views/monitoreo/AlertsDashboard'))
const ServiceStatus = React.lazy(() => import('./views/monitoreo/ServiceStatus'))

// AUDITORÍA
const HistorialCambios = React.lazy(() => import('./views/Auditoria/HistorialCambios'))
const LogsViewer = React.lazy(() => import('./views/Auditoria/Logsviewer'))

// CUENTA
const UserProfile = React.lazy(() => import('./views/perfil/Userprofile'))

/**
 * Configuración de Rutas de la Aplicación (RBAC Numérico)
 * 1 = Administrador (Control total)
 * 2 = Tecnico (Gestión monitoreo / Soporte)
 * 3 = Auditor (Consulta auditoría / Lectura)
 */
export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/request-access', name: 'RequestAccess', element: RequestAccess },
  
  // Dashboard principal (Accesible para todos los usuarios autenticados)
  { path: '/dashboard', name: 'Dashboard', element: DashboardAdmin },
  
  // Inventario de Servidores
  { 
    path: '/servidores', 
    name: 'Servidores', 
    element: Table, 
    rolesPermitidos: [1, 2, 3] // Administrador, Técnico y Auditor pueden ver la tabla
  },
  { 
    path: '/servidores/registrar', 
    name: 'Registro-Servidor', 
    element: Register, 
    rolesPermitidos: [1, 2] // Solo Administrador y Técnico pueden registrar nuevos servidores
  },

  // Sección de Usuarios y Seguridad (Exclusivo Administrador)
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    element: Users, 
    rolesPermitidos: [1] 
  },
  { 
    path: '/crear-usuario', 
    name: 'Crear Usuario', 
    element: CreateUser, 
    rolesPermitidos: [1] 
  },
  { 
    path: '/usuarios/Roles', 
    name: 'Roles y Permisos', 
    element: Roles, 
    rolesPermitidos: [1] 
  },
  { 
    path: '/usuarios/Solicitudes-Acceso', 
    name: 'Solicitudes De Acceso', 
    element: AccessReq, 
    rolesPermitidos: [1] 
  },

  // Monitoreo
  { 
    path: '/monitoreo/alertas', 
    name: 'Alertas', 
    element: AlertsDashboard, 
    rolesPermitidos: [1, 2, 3] // Todos los roles tienen acceso visual a las alertas
  },
  { 
    path: '/monitoreo/estado-servicios', 
    name: 'Estado de los servicios', 
    element: ServiceStatus, 
    rolesPermitidos: [1, 2, 3] 
  },

  // Auditoría
  { 
    path: '/historialCambios', 
    name: 'Historial Cambios', 
    element: HistorialCambios, 
    rolesPermitidos: [1, 3] // El Administrador y el Auditor pueden revisar el historial
  },
  { 
    path: '/logs', 
    name: 'Logs del Sistema', 
    element: LogsViewer, 
    rolesPermitidos: [1, 3] 
  },

  // Perfil del usuario conectado (Público/Cualquier usuario autenticado)
  { path: '/perfil', name: 'Perfil', element: UserProfile },
]

export default routes