import React, { useEffect, useState } from 'react'
import axios from 'axios'

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

      case 'Activo':
        return 'success'

      case 'En mantenimiento':
        return 'warning'

      case 'Caído':
        return 'danger'

      case 'Inactivo':
        return 'dark'

      default:
        return 'secondary'
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

  // =========================
  // RESUMEN SERVIDORES
  // =========================

  const totalServidores = servidores.length

  const activos = servidores.filter(
    (s) => s.estado === 'Activo'
  ).length

  const mantenimiento = servidores.filter(
    (s) => s.estado === 'En mantenimiento'
  ).length

  const caidos = servidores.filter(
    (s) => s.estado === 'Caído'
  ).length

  const porcentaje = (valor) => {

    if (totalServidores === 0) return 0

    return (
      (valor / totalServidores) * 100
    ).toFixed(1)
  }

  // =========================
  // FILTROS
  // =========================

  const filteredServers = servidores.filter((server) => {

    const matchSearch =
      server.nombre
        ?.toLowerCase()
        .includes(search.toLowerCase())

    const matchEstado =
      estadoFilter === '' ||
      server.estado === estadoFilter

    return matchSearch && matchEstado
  })

  return (

    <CCard className="border-0 shadow-sm">

      <CCardHeader className="bg-white border-bottom">

        <div>

          <h5 className="mb-1 fw-semibold">
            Servidores
          </h5>

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

                <h6 className="text-medium-emphasis mb-1">
                  Activos
                </h6>

                <h2 className="fw-bold text-success">
                  {activos}
                </h2>

                <small className="text-medium-emphasis">
                  {porcentaje(activos)}% del total
                </small>

                <div
                  className="progress mt-2"
                  style={{ height: '6px' }}
                >

                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${porcentaje(activos)}%`,
                    }}
                  />

                </div>

              </CCardBody>

            </CCard>

          </CCol>

          <CCol md={3}>

            <CCard className="border-0 shadow-sm h-100">

              <CCardBody>

                <h6 className="text-medium-emphasis mb-1">
                  En mantenimiento
                </h6>

                <h2 className="fw-bold text-warning">
                  {mantenimiento}
                </h2>

                <small className="text-medium-emphasis">
                  {porcentaje(mantenimiento)}% del total
                </small>

                <div
                  className="progress mt-2"
                  style={{ height: '6px' }}
                >

                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width: `${porcentaje(mantenimiento)}%`,
                    }}
                  />

                </div>

              </CCardBody>

            </CCard>

          </CCol>

          <CCol md={3}>

            <CCard className="border-0 shadow-sm h-100">

              <CCardBody>

                <h6 className="text-medium-emphasis mb-1">
                  Caídos
                </h6>

                <h2 className="fw-bold text-danger">
                  {caidos}
                </h2>

                <small className="text-medium-emphasis">
                  {porcentaje(caidos)}% del total
                </small>

                <div
                  className="progress mt-2"
                  style={{ height: '6px' }}
                >

                  <div
                    className="progress-bar bg-danger"
                    style={{
                      width: `${porcentaje(caidos)}%`,
                    }}
                  />

                </div>

              </CCardBody>

            </CCard>

          </CCol>

          <CCol md={3}>

            <CCard className="border-0 shadow-sm h-100">

              <CCardBody>

                <h6 className="text-medium-emphasis mb-1">
                  Total
                </h6>

                <h2 className="fw-bold text-primary">
                  {totalServidores}
                </h2>

                <small className="text-medium-emphasis">
                  100% del total
                </small>

                <div
                  className="progress mt-2"
                  style={{ height: '6px' }}
                >

                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: '100%',
                    }}
                  />

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </CInputGroup>

          </CCol>

          <CCol md={2}>

            <CFormSelect
              value={estadoFilter}
              onChange={(e) =>
                setEstadoFilter(e.target.value)
              }
            >

              <option value="">
                Estado: Todos
              </option>

              <option value="Activo">
                Activo
              </option>

              <option value="En mantenimiento">
                En mantenimiento
              </option>

              <option value="Caído">
                Caído
              </option>

              <option value="Inactivo">
                Inactivo
              </option>

            </CFormSelect>

          </CCol>

        </CRow>

        {/* TABLA */}

        <CTable
          hover
          responsive
          align="middle"
        >

          <CTableHead className="table-light">

            <CTableRow>

              <CTableHeaderCell>
                Servidor
              </CTableHeaderCell>

              <CTableHeaderCell>
                IP
              </CTableHeaderCell>

              <CTableHeaderCell>
                Sistema operativo
              </CTableHeaderCell>

              <CTableHeaderCell>
                Estado
              </CTableHeaderCell>

              <CTableHeaderCell>
                Fecha registro
              </CTableHeaderCell>

              <CTableHeaderCell className="text-center">
                Acciones
              </CTableHeaderCell>

            </CTableRow>

          </CTableHead>

          <CTableBody>

            {filteredServers.length > 0 ? (

              filteredServers.map((server) => (

                <CTableRow
                  key={server.id_servidor}
                >

                  <CTableDataCell className="fw-semibold">
                    {server.nombre}
                  </CTableDataCell>

                  <CTableDataCell>
                    {server.ip}
                  </CTableDataCell>

                  <CTableDataCell>
                    {server.sistema_operativo}
                  </CTableDataCell>

                  <CTableDataCell>

                    <CBadge
                      color={getBadgeColor(server.estado)}
                    >
                      {server.estado || 'Sin estado'}
                    </CBadge>

                  </CTableDataCell>

                  <CTableDataCell>

                    {server.fecha_registro
                      ? new Date(
                          server.fecha_registro
                        ).toLocaleString()
                      : 'Sin fecha'}

                  </CTableDataCell>

                  <CTableDataCell>

                    <div className="d-flex justify-content-center gap-2">

                      <CButton
                        color="light"
                        size="sm"
                        onClick={() =>
                          handleView(server)
                        }
                      >
                        <CIcon icon={cilZoom} />
                      </CButton>

                      <CButton
                        color="light"
                        size="sm"
                        onClick={() =>
                          handleEdit(server)
                        }
                      >
                        <CIcon icon={cilPen} />
                      </CButton>

                      <CButton
                        color="light"
                        size="sm"
                        onClick={() =>
                          handleDelete(server)
                        }
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>

                    </div>

                  </CTableDataCell>

                </CTableRow>

              ))

            ) : (

              <CTableRow>

                <CTableDataCell
                  colSpan={6}
                  className="text-center py-4"
                >
                  No hay servidores registrados
                </CTableDataCell>

              </CTableRow>

            )}

          </CTableBody>

        </CTable>

      </CCardBody>

    </CCard>
  )
}

export default Table