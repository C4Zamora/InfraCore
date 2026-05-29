import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

import obtenerNavegacionPorRol from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  
  // Función interna para mapear y extraer el id_rol desde el objeto 'usuario' del LocalStorage
  const obtenerIdRolDelStorage = () => {
    try {
      const datosUsuario = localStorage.getItem('usuario')
      if (datosUsuario) {
        const usuarioObj = JSON.parse(datosUsuario)
        return parseInt(usuarioObj.id_rol, 10) || 3 // Si existe, retorna el id_rol (ej: 2)
      }
    } catch (error) {
      console.error("Error al parsear el usuario en el Sidebar:", error)
    }
    return 3 // Retorna rol 3 (Auditor / Solo lectura) por seguridad si no hay nadie logueado
  }

  const [rolIdActual, setRolIdActual] = useState(obtenerIdRolDelStorage())

  useEffect(() => {
    // Al cambiar la visibilidad o cargar el componente, actualizamos el estado con el ID real
    setRolIdActual(obtenerIdRolDelStorage())
  }, [sidebarShow])

  const menuFiltrado = obtenerNavegacionPorRol(rolIdActual)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Reconstruye el componente de forma limpia según el ID extraído */}
      <AppSidebarNav key={rolIdActual} items={menuFiltrado} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default AppSidebar