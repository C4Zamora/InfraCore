import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import { routes } from '../routes'

const AppContent = () => {
  // Leemos el ID del almacenamiento local
  const usuarioRolId = parseInt(localStorage.getItem('usuario_rol_id'), 10) || 1

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    // Validamos si la ruta requiere privilegios y si el ID actual del usuario está autorizado
                    route.rolesPermitidos && !route.rolesPermitidos.includes(usuarioRolId) ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route index element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
