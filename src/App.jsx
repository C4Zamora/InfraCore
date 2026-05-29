import React, { Suspense, useEffect } from 'react'

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import './scss/examples.scss'

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages públicas
const Login = React.lazy(() => import('./views/pages/login/Login'))
const RequestAccess = React.lazy(() => import('./views/pages/requestAccess/RequestAccess'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// GUARD SIMPLE (sin archivo externo obligatorio)
const PrivateRoute = ({ children }) => {

  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {

  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  )

  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) return

    setColorMode(storedTheme)

  }, [])

  return (

    <BrowserRouter>

      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >

        <Routes>

          {/* ===================== */}
          {/* RUTAS PUBLICAS */}
          {/* ===================== */}

          <Route path="/login" element={<Login />} />

          <Route path="/request-access" element={<RequestAccess />} />

          <Route path="/404" element={<Page404 />} />

          <Route path="/500" element={<Page500 />} />

          {/* ===================== */}
          {/* RUTAS PROTEGIDAS */}
          {/* ===================== */}

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  )
}

export default App