import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilShieldAlt,
  cilMonitor,
  cilClipboard,
  cilSettings,
  cilUser,
  cilAccountLogout,
  cilLibrary,
  cilSpeedometer,
} from '@coreui/icons'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Inventario',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Servidores',
        to: '/servidores',
      },
      {
        component: CNavItem,
        name: 'Registro-Servidor',
        to: '/servidores/registrar',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Usuarios y Accesos',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/usuarios',
      },
      {
        component: CNavItem,
        name: 'Roles y Permisos',
        to: '/usuarios/Roles',
      },
      {
        component: CNavItem,
        name: 'Solicitudes De Acceso',
        to: '/usuarios/Solicitudes-Acceso',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Monitoreo',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alertas',
        to: '/monitoreo/alertas',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Auditoria',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Historial De Cambios',
        to: '/historialCambios',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Configuración',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Parámetros del Sistema',
        to: '/configuracion',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Cuenta',
  },

  {
    component: CNavItem,
    name: 'Mi Perfil',
    to: '/perfil',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Cerrar Sesión',
    to: '#logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav