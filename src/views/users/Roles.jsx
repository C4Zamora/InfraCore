import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../Styles/user.css'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPlus, cilShieldAlt } from '@coreui/icons'

const modules = [
  'Dashboard',
  'Inventario',
  'Servidores',
  'Usuarios y Accesos',
  'Monitoreo',
  'Auditoría',
  'Reportes',
  'Configuración',
]

const roleVisualConfig = {
  Administrador: {
    color: 'purple',
    descripcion: 'Acceso completo al sistema y configuración.',
    permisos: {
      dashboard: true,
      inventario: true,
      servidores: true,
      usuarios: true,
      monitoreo: true,
      auditoria: true,
      reportes: true,
      configuracion: true,
    },
  },
  Técnico: {
    color: 'green',
    descripcion: 'Administración básica de servidores.',
    permisos: {
      dashboard: true,
      inventario: true,
      servidores: true,
      usuarios: false,
      monitoreo: true,
      auditoria: false,
      reportes: false,
      configuracion: false,
    },
  },
  Auditor: {
    color: 'yellow',
    descripcion: 'Acceso de solo lectura a reportes y auditorías.',
    permisos: {
      dashboard: true,
      inventario: false,
      servidores: false,
      usuarios: false,
      monitoreo: true,
      auditoria: true,
      reportes: true,
      configuracion: false,
    },
  },
  Usuario: {
    color: 'gray',
    descripcion: 'Acceso limitado a información asignada.',
    permisos: {
      dashboard: true,
      inventario: false,
      servidores: false,
      usuarios: false,
      monitoreo: false,
      auditoria: false,
      reportes: false,
      configuracion: false,
    },
  },
}

const defaultRole = {
  permisos: {
    dashboard: false,
    inventario: false,
    servidores: false,
    usuarios: false,
    monitoreo: false,
    auditoria: false,
    reportes: false,
    configuracion: false,
  },
}

const Roles = () => {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(
          'http://localhost:3001/api/usuarios/roles/conteo'
        )

        console.log('BACKEND RESPONSE:', response.data)

        const rawData = Array.isArray(response.data)
          ? response.data
          : []

        const normalized = rawData.map((role) => {
          const visual = roleVisualConfig[role.nombre] || {}

          return {
            id: role.id_rol,
            nombre: role.nombre,
            descripcion: role.descripcion || visual.descripcion,
            usuarios: Number(role.usuarios ?? 0),
            color: visual.color || 'gray',
            permisos: visual.permisos || defaultRole.permisos,
          }
        })

        setRoles(normalized)
        setSelectedRole(normalized[0] || null)
      } catch (err) {
        console.error('ERROR BACKEND:', err)

        setError(
          err?.response?.data?.message ||
            err.message ||
            'Error cargando roles'
        )

        setRoles([])
        setSelectedRole(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const handleCreateRole = () => {
    console.log('Crear rol')
  }

  const getPermissionValue = (module) => {
    if (!selectedRole) return false

    const permisos = selectedRole.permisos

    switch (module) {
      case 'Dashboard':
        return permisos.dashboard
      case 'Inventario':
        return permisos.inventario
      case 'Servidores':
        return permisos.servidores
      case 'Usuarios y Accesos':
        return permisos.usuarios
      case 'Monitoreo':
        return permisos.monitoreo
      case 'Auditoría':
        return permisos.auditoria
      case 'Reportes':
        return permisos.reportes
      case 'Configuración':
        return permisos.configuracion
      default:
        return false
    }
  }

  return (
    <div className="roles-container">
      {/* HEADER */}
      <div className="roles-header">
        <div>
          <h3 className="roles-title">Roles y permisos</h3>
          <p className="roles-subtitle">
            Gestione los roles del sistema y los permisos asignados a cada uno.
          </p>
        </div>

        <CButton className="create-role-btn" onClick={handleCreateRole}>
          <CIcon icon={cilPlus} className="me-2" />
          Crear rol
        </CButton>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>
          ❌ {error}
        </div>
      )}

      <CRow className="g-4">
        {/* LISTA ROLES */}
        <CCol lg={4}>
          <CCard className="roles-card">
            <CCardHeader className="roles-card-header">
              Roles del sistema
            </CCardHeader>

            <CCardBody className="roles-list">
              {loading && <p>Cargando roles...</p>}

              {!loading &&
                roles.map((role) => (
                  <div
                    key={role.id}
                    className={`role-item ${
                      selectedRole?.id === role.id ? 'active-role' : ''
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="role-left">
                      <div className={`role-icon ${role.color}`}>
                        <CIcon icon={cilShieldAlt} />
                      </div>

                      <div>
                        <h6 className="role-name">{role.nombre}</h6>
                        <p className="role-description">
                          {role.descripcion}
                        </p>
                      </div>
                    </div>

                    <div className="role-users">
                      {role.usuarios} usuario
                      {role.usuarios !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
            </CCardBody>
          </CCard>
        </CCol>

        {/* PERMISOS */}
        <CCol lg={8}>
          <CCard className="roles-card">
            <CCardHeader className="roles-card-header">
              Permisos del rol:{' '}
              <span className="selected-role-name">
                {selectedRole?.nombre || 'N/A'}
              </span>
            </CCardHeader>

            <CCardBody>
              {!selectedRole ? (
                <p>No hay rol seleccionado</p>
              ) : (
                <CTable responsive align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Módulo</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        Acceso
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {modules.map((module, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{module}</CTableDataCell>

                        <CTableDataCell className="text-center">
                          {getPermissionValue(module) && (
                            <CIcon icon={cilCheckAlt} />
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <div className="roles-footer">
        Los permisos se aplican en función del rol asignado a cada usuario.
      </div>
    </div>
  )
}

export default Roles