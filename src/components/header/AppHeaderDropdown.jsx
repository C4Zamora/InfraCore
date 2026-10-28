import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  // Leer información del usuario en sesión
  let usuario = null
  try {
    const raw = localStorage.getItem('usuario')
    if (raw) usuario = JSON.parse(raw)
  } catch (e) {
    usuario = null
  }

  const initial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'
  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido || ''}` : 'Usuario'
  const correo = usuario?.correo || 'usuario@infracore.local'
  const idRol = parseInt(localStorage.getItem('usuario_rol_id') || usuario?.id_rol || 3, 10)

  const rolTexto = idRol === 1 ? 'Administrador' : idRol === 2 ? 'Técnico' : idRol === 3 ? 'Auditor' : 'Usuario'
  const rolBadgeColor = idRol === 1 ? 'primary' : idRol === 2 ? 'success' : idRol === 3 ? 'warning' : 'secondary'

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0 d-flex align-items-center" caret={false}>
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold shadow-sm"
          style={{ width: 38, height: 38, fontSize: '1rem', cursor: 'pointer' }}
          title={nombreCompleto}
        >
          {initial}
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0 shadow-lg border-0" placement="bottom-end" style={{ minWidth: 240 }}>
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2 py-3">
          <div className="d-flex flex-column">
            <span className="text-body fw-bold">{nombreCompleto}</span>
            <span className="text-muted text-sm">{correo}</span>
            <div className="mt-1">
              <CBadge color={rolBadgeColor} size="sm">
                {rolTexto}
              </CBadge>
            </div>
          </div>
        </CDropdownHeader>

        <CDropdownItem onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2 text-primary" />
          Mi Perfil
        </CDropdownItem>

        {idRol === 1 && (
          <CDropdownItem onClick={() => navigate('/configuracion')} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilSettings} className="me-2 text-info" />
            Parámetros del Sistema
          </CDropdownItem>
        )}

        <CDropdownDivider />

        <CDropdownItem onClick={handleLogout} className="text-danger" style={{ cursor: 'pointer' }}>
          <CIcon icon={cilLockLocked} className="me-2 text-danger" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
