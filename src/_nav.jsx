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

import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'

const obtenerNavegacionPorRol = (idRolUsuario) => {
  // Forzamos a que el ID sea un número entero para evitar fallos si viene como string "2"
  const idRol = parseInt(idRolUsuario, 10) || 3; // Por defecto rol 3 (Auditor) si no hay sesión

  const menuCompleto = [
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
      rolesPermitidos: [1, 2, 3], // Admin, Técnico y Auditor pueden ver el grupo
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
          rolesPermitidos: [1, 2], // Solo Admin (1) y Técnico (2) registran
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Usuarios y Accesos',
      icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
      rolesPermitidos: [1], // Exclusivo Administrador
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
      rolesPermitidos: [1, 2, 3], // Todos ven alertas
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
      rolesPermitidos: [1, 3], // Solo Administrador (1) y Auditor (3)
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
      rolesPermitidos: [1], // Exclusivo Administrador
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

  // Algoritmo de filtrado por ID numérico
  const resultadoFiltrado = []

  for (const item of menuCompleto) {
    if (item.rolesPermitidos && !item.rolesPermitidos.includes(idRol)) {
      continue; 
    }

    if (item.items) {
      const hijosPermitidos = item.items.filter(hijo => {
        if (!hijo.rolesPermitidos) return true;
        return hijo.rolesPermitidos.includes(idRol);
      });

      if (hijosPermitidos.length === 0) {
        continue;
      }

      resultadoFiltrado.push({
        ...item,
        items: hijosPermitidos
      });
    } else {
      resultadoFiltrado.push(item);
    }
  }

  return resultadoFiltrado;
}

export default obtenerNavegacionPorRol