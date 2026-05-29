import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../../Styles/servidores.css'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cilSearch,
  cilPen,
  cilTrash,
  cilZoom,
} from '@coreui/icons'

const Table = () => {

  const [servidores, setServidores] = useState([])
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')

  const [visibleView, setVisibleView] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)

  const [selectedServer, setSelectedServer] = useState(null)

  useEffect(() => {
    obtenerServidores()
  }, [])

  const obtenerServidores = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/servidores'
      )
      setServidores(response.data)
    } catch (error) {
      console.error(
        'Error obteniendo servidores:',
        error
      )
    }
  }

  const actualizarServidor = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/servidores/${selectedServer.id_servidor}`,
        selectedServer
      )
      alert('Servidor actualizado correctamente')
      setVisibleEdit(false)
      obtenerServidores()
    } catch (error) {
      console.error(error)
      alert('Error actualizando servidor')
    }
  }

  const eliminarServidor = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/servidores/${selectedServer.id_servidor}`
      )
      alert('Servidor eliminado correctamente')
      setVisibleDelete(false)
      obtenerServidores()
    } catch (error) {
      console.error(error)
      alert('Error eliminando servidor')
    }
  }

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'success'
      case 'En mantenimiento': return 'warning'
      case 'Caído': return 'danger'
      case 'Inactivo': return 'dark'
      default: return 'secondary'
    }
  }

  const handleView = (server) => {
    setSelectedServer(server)
    setVisibleView(true)
  }

  const handleEdit = (server) => {
    setSelectedServer(server)
    setVisibleEdit(true)
  }

  const handleDelete = (server) => {
    setSelectedServer(server)
    setVisibleDelete(true)
  }

  // Resumen servidores
  const totalServidores = servidores.length
  const activos = servidores.filter((s) => s.estado === 'Activo').length
  const mantenimiento = servidores.filter((s) => s.estado === 'En mantenimiento').length
  const caidos = servidores.filter((s) => s.estado === 'Caído').length

  const porcentaje = (valor) => {
    if (totalServidores === 0) return 0
    return ((valor / totalServidores) * 100).toFixed(1)
  }

  // Filtros
  const filteredServers = servidores.filter((server) => {
    const matchSearch = server.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estadoFilter === '' || server.estado === estadoFilter
    return matchSearch && matchEstado
  })

  return (
    <CCard className="border-0 shadow-sm">
      <CCardHeader className="bg-white border-bottom">
        <div>
          <h5 className="mb-1 fw-semibold">Servidores</h5>
          <small className="text-medium-emphasis">
            Consulta y gestión de servidores registrados
          </small>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* CARDS RESUMEN */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <h6 className="text-medium-emphasis mb-1">Activos</h6>
                <h2 className="fw-bold text-success">{activos}</h2>
                <small className="text-medium-emphasis">{porcentaje(activos)}% del total</small>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${porcentaje(activos)}%` }} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <h6 className="text-medium-emphasis mb-1">En mantenimiento</h6>
                <h2 className="fw-bold text-warning">{mantenimiento}</h2>
                <small className="text-medium-emphasis">{porcentaje(mantenimiento)}% del total</small>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div className="progress-bar bg-warning" style={{ width: `${porcentaje(mantenimiento)}%` }} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <h6 className="text-medium-emphasis mb-1">Caídos</h6>
                <h2 className="fw-bold text-danger">{caidos}</h2>
                <small className="text-medium-emphasis">{porcentaje(caidos)}% del total</small>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div className="progress-bar bg-danger" style={{ width: `${porcentaje(caidos)}%` }} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <h6 className="text-medium-emphasis mb-1">Total</h6>
                <h2 className="fw-bold text-primary">{totalServidores}</h2>
                <small className="text-medium-emphasis">100% del total</small>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '100%' }} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* FILTROS */}
        <CRow className="g-3 mb-4">
          <CCol md={4}>
            <CInputGroup>
              <span className="input-group-text bg-white">
                <CIcon icon={cilSearch} size="sm" />
              </span>
              <CFormInput
                placeholder="Buscar servidor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CInputGroup>
          </CCol>
          <CCol md={2}>
            <CFormSelect value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
              <option value="">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Caído">Caído</option>
              <option value="Inactivo">Inactivo</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {/* TABLA */}
        <CTable hover responsive align="middle">
          <CTableHead className="table-light">
            <CTableRow>
              <CTableHeaderCell>Servidor</CTableHeaderCell>
              <CTableHeaderCell>IP</CTableHeaderCell>
              <CTableHeaderCell>Sistema operativo</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Fecha registro</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredServers.length > 0 ? (
              filteredServers.map((server) => (
                <CTableRow key={server.id_servidor}>
                  <CTableDataCell className="fw-semibold">{server.nombre}</CTableDataCell>
                  <CTableDataCell>{server.ip}</CTableDataCell>
                  <CTableDataCell>{server.sistema_operativo}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getBadgeColor(server.estado)}>
                      {server.estado || 'Sin estado'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {server.fecha_registro ? new Date(server.fecha_registro).toLocaleString() : 'Sin fecha'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex justify-content-center gap-2">
                      <CButton color="light" size="sm" onClick={() => handleView(server)}>
                        <CIcon icon={cilZoom} />
                      </CButton>
                      <CButton color="light" size="sm" onClick={() => handleEdit(server)}>
                        <CIcon icon={cilPen} />
                      </CButton>
                      <CButton color="light" size="sm" onClick={() => handleDelete(server)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center py-4">
                  No hay servidores registrados
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* ================================================================= */}
      {/* MODAL: VER DETALLES */}
      {/* ================================================================= */}
      <CModal visible={visibleView} onClose={() => setVisibleView(false)}>
        <CModalHeader>
          <CModalTitle>Detalles del Servidor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedServer && (
            <div>
              <p><strong>Nombre:</strong> {selectedServer.nombre}</p>
              <p><strong>IP:</strong> {selectedServer.ip}</p>
              <p><strong>Sistema Operativo:</strong> {selectedServer.sistema_operativo}</p>
              <p><strong>Estado:</strong> {selectedServer.estado}</p>
              <p><strong>Fecha Registro:</strong> {selectedServer.fecha_registro ? new Date(selectedServer.fecha_registro).toLocaleString() : 'N/A'}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleView(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>


{/* MODAL: EDITAR SERVIDOR */}
{/* ================================================================= */}
{/* ================================================================= */}
{/* MODAL: EDITAR SERVIDOR (ESTILO SWEETALERT) */}
{/* ================================================================= */}
<CModal 
  visible={visibleEdit} 
  onClose={() => setVisibleEdit(false)}
  alignment="center"
  size="lg"
>
  {/* Header limpio sin bordes divisorios */}
  <CModalHeader className="border-0 pt-4 px-4 pb-0">
    <CModalTitle className="fs-3 fw-bold text-dark w-100 text-center">
      Editar Servidor
    </CModalTitle>
  </CModalHeader>
  
  <CModalBody className="px-5 py-4">
    {selectedServer && (
      <div className="d-flex flex-column gap-3 text-start">
        <div>
          <label className="form-label text-secondary fw-semibold small">Nombre del Servidor</label>
          <CFormInput 
            className="py-2 bg-light border-0 shadow-sm"
            style={{ borderRadius: '0.375rem' }}
            value={selectedServer.nombre || ''} 
            onChange={(e) => setSelectedServer({...selectedServer, nombre: e.target.value})}
          />
        </div>
        <div>
          <label className="form-label text-secondary fw-semibold small">Dirección IP</label>
          <CFormInput 
            className="py-2 bg-light border-0 shadow-sm"
            style={{ borderRadius: '0.375rem' }}
            value={selectedServer.ip || ''} 
            onChange={(e) => setSelectedServer({...selectedServer, ip: e.target.value})}
          />
        </div>
        <div>
          <label className="form-label text-secondary fw-semibold small">Sistema Operativo</label>
          <CFormInput 
            className="py-2 bg-light border-0 shadow-sm"
            style={{ borderRadius: '0.375rem' }}
            value={selectedServer.sistema_operativo || ''} 
            onChange={(e) => setSelectedServer({...selectedServer, sistema_operativo: e.target.value})}
          />
        </div>
        <div>
          <label className="form-label text-secondary fw-semibold small">Estado del Servidor</label>
          <CFormSelect 
            className="py-2 bg-light border-0 shadow-sm"
            style={{ borderRadius: '0.375rem' }}
            value={selectedServer.id_estado || ''} 
            onChange={(e) => {
              const id = Number(e.target.value);
              const textos = { 1: 'Activo', 2: 'En mantenimiento', 3: 'Caído', 4: 'Inactivo' };
              setSelectedServer({
                ...selectedServer, 
                id_estado: id,
                estado: textos[id]
              });
            }}
          >
            <option value={1}>Activo</option>
            <option value={2}>En mantenimiento</option>
            <option value={3}>Caído</option>
            <option value={4}>Inactivo</option>
          </CFormSelect>
        </div>
      </div>
    )}
  </CModalBody>

  {/* Footer limpio y centrado */}
  <CModalFooter className="border-0 pb-4 justify-content-center gap-2">
    <CButton 
      color="secondary" 
      className="px-4 py-2"
      style={{ backgroundColor: '#7b8a8b', border: 'none' }}
      onClick={() => setVisibleEdit(false)}
    >
      Descartar
    </CButton>
    <CButton 
      color="primary" 
      className="px-4 py-2 shadow-sm"
      style={{ backgroundColor: '#3498db', border: 'none' }}
      onClick={actualizarServidor}
    >
      Guardar Cambios
    </CButton>
  </CModalFooter>
</CModal>
      {/* ================================================================= */}
      {/* MODAL: ELIMINAR SERVIDOR */}
      {/* ================================================================= */}
      <CModal visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedServer && (
            <p>¿Estás seguro de que deseas eliminar el servidor <strong>{selectedServer.nombre}</strong>? Esta acción no se puede deshacer.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>Cancelar</CButton>
          <CButton color="danger" className="text-white" onClick={eliminarServidor}>Eliminar de todos modos</CButton>
        </CModalFooter>
      </CModal>

    </CCard>
  )
}

export default Table