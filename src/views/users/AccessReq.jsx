import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import axios from 'axios'

import '../../Styles/user.css'

import Swal from 'sweetalert2'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cilCheckAlt,
  cilSearch,
  cilX,
} from '@coreui/icons'

const AccessReq = () => {

  const [requestsData, setRequestsData] =
    useState([])

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] =
    useState('Todos')

  const [visible, setVisible] =
    useState(false)

  const [selectedRequest, setSelectedRequest] =
    useState(null)

  const [approveData, setApproveData] =
    useState({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      id_rol: '',
    })

  // CARGAR SOLICITUDES
  useEffect(() => {

    fetchRequests()

  }, [])

  const fetchRequests = async () => {

    try {

      const response = await axios.get(
        'http://localhost:3001/api/solicitudes'
      )

      setRequestsData(response.data)

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las solicitudes',
      })

    }

  }

  // FILTROS
  const filteredRequests = useMemo(() => {

    return requestsData.filter((request) => {

      const matchesSearch =
        request.nombre_completo
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        request.correo
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        String(request.id_solicitud)
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'Todos' ||
        request.estado === statusFilter

      return matchesSearch && matchesStatus

    })

  }, [requestsData, search, statusFilter])

  // COLORES ESTADO
  const getStatusColor = (status) => {

    switch (status) {

      case 'Aprobada':
        return 'success'

      case 'Pendiente':
        return 'warning'

      case 'Rechazada':
        return 'danger'

      default:
        return 'secondary'

    }

  }

  // CLASES ROL
  const getRoleClass = (role) => {

    switch (role) {

      case 'Administrador':
        return 'role-admin'

      case 'Técnico':
        return 'role-tech'

      case 'Auditor':
        return 'role-auditor'

      default:
        return 'role-default'

    }

  }

  // ABRIR MODAL APROBACIÓN
  const handleApprove = (request) => {

    const names =
      request.nombre_completo.split(' ')

    setSelectedRequest(request)

    setApproveData({
      nombre: names[0] || '',
      apellido: names.slice(1).join(' '),
      correo: request.correo,
      password: '',
      id_rol: request.id_rol,
    })

    setVisible(true)

  }

  // APROBAR SOLICITUD
  const submitApproval = async () => {

    try {

      await axios.post(
        'http://localhost:3001/api/solicitudes/aprobar',
        {
          id_solicitud:
            selectedRequest.id_solicitud,

          ...approveData,
        }
      )

      Swal.fire({
        icon: 'success',
        title: 'Solicitud aprobada',
        text: 'Usuario creado correctamente',
      })

      setVisible(false)

      fetchRequests()

    } catch (error) {

  console.log('ERROR COMPLETO:')
  console.log(error)

  console.log('RESPONSE:')
  console.log(error.response)

  console.log('DATA:')
  console.log(error.response?.data)

  Swal.fire({
    icon: 'error',
    title: 'Error backend',
    text: JSON.stringify(error.response?.data),
  })

}

  }

  // RECHAZAR
  const handleReject = async (requestId) => {

    try {

      await axios.post(
        'http://localhost:3001/api/solicitudes/rechazar',
        {
          id_solicitud: requestId,
        }
      )

      Swal.fire({
        icon: 'success',
        title: 'Solicitud rechazada',
      })

      fetchRequests()

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo rechazar la solicitud',
      })

    }

  }

  return (

    <div className="access-container">

      <div className="access-header">

        <div>

          <h3 className="access-title">
            Solicitudes de acceso
          </h3>

          <p className="access-subtitle">
            Revisa y gestiona las solicitudes de acceso enviadas por los usuarios.
          </p>

        </div>

      </div>

      <CCard className="access-card">

        <CCardBody>

          <CRow className="g-3 mb-4">

            <CCol md={3}>

              <CFormSelect
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="custom-select"
              >

                <option value="Todos">
                  Estado: Todos
                </option>

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="Aprobada">
                  Aprobada
                </option>

                <option value="Rechazada">
                  Rechazada
                </option>

              </CFormSelect>

            </CCol>

            <CCol md={3}>

              <CFormInput
                type="date"
                className="custom-input"
              />

            </CCol>

            <CCol md={6}>

              <CInputGroup>

                <span className="input-group-text search-icon">
                  <CIcon icon={cilSearch} />
                </span>

                <CFormInput
                  placeholder="Buscar solicitante..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="custom-input"
                />

              </CInputGroup>

            </CCol>

          </CRow>

          <CTable
            hover
            responsive
            align="middle"
            className="requests-table"
          >

            <CTableHead>

              <CTableRow>

                <CTableHeaderCell>
                  ID Solicitud
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Solicitante
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Correo electrónico
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Rol solicitado
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Fecha solicitud
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Estado
                </CTableHeaderCell>

                <CTableHeaderCell className="text-center">
                  Acciones
                </CTableHeaderCell>

              </CTableRow>

            </CTableHead>

            <CTableBody>

              {filteredRequests.map((request) => (

                <CTableRow
                  key={request.id_solicitud}
                >

                  <CTableDataCell className="request-id">
                    SOL-{request.id_solicitud}
                  </CTableDataCell>

                  <CTableDataCell>
                    {request.nombre_completo}
                  </CTableDataCell>

                  <CTableDataCell>
                    {request.correo}
                  </CTableDataCell>

                  <CTableDataCell>

                    <span
                      className={`role-badge ${getRoleClass(
                        request.rol,
                      )}`}
                    >
                      {request.rol}
                    </span>

                  </CTableDataCell>

                  <CTableDataCell>
                    {request.fecha_solicitud}
                  </CTableDataCell>

                  <CTableDataCell>

                    <CBadge
                      color={getStatusColor(
                        request.estado,
                      )}
                    >
                      {request.estado}
                    </CBadge>

                  </CTableDataCell>

                  <CTableDataCell>

                    <div className="actions-container">

                      <CButton
                        color="light"
                        size="sm"
                        className="approve-btn"
                        onClick={() =>
                          handleApprove(request)
                        }
                      >
                        <CIcon icon={cilCheckAlt} />
                      </CButton>

                      <CButton
                        color="light"
                        size="sm"
                        className="reject-btn"
                        onClick={() =>
                          handleReject(
                            request.id_solicitud
                          )
                        }
                      >
                        <CIcon icon={cilX} />
                      </CButton>

                    </div>

                  </CTableDataCell>

                </CTableRow>

              ))}

            </CTableBody>

          </CTable>

          <div className="table-footer">

            <span>
              Mostrando 1 a {filteredRequests.length} de{' '}
              {requestsData.length} solicitudes
            </span>

            <div className="pagination-container">

              <button className="pagination-btn">
                {'<'}
              </button>

              <button className="pagination-btn active-page">
                1
              </button>

              <button className="pagination-btn">
                {'>'}
              </button>

            </div>

          </div>

        </CCardBody>

      </CCard>

      {/* MODAL APROBACIÓN */}

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
      >

        <CModalHeader>

          <CModalTitle>
            Aprobar solicitud
          </CModalTitle>

        </CModalHeader>

        <CModalBody>

          <div className="mb-3">

            <label>Nombre</label>

            <CFormInput
              value={approveData.nombre}
              onChange={(e) =>
                setApproveData({
                  ...approveData,
                  nombre: e.target.value,
                })
              }
            />

          </div>

          <div className="mb-3">

            <label>Apellido</label>

            <CFormInput
              value={approveData.apellido}
              onChange={(e) =>
                setApproveData({
                  ...approveData,
                  apellido: e.target.value,
                })
              }
            />

          </div>

          <div className="mb-3">

            <label>Correo</label>

            <CFormInput
              value={approveData.correo}
              onChange={(e) =>
                setApproveData({
                  ...approveData,
                  correo: e.target.value,
                })
              }
            />

          </div>

       

          <div className="mb-3">

            <label>Contraseña</label>

            <CFormInput
              type="password"
              value={approveData.password}
              onChange={(e) =>
                setApproveData({
                  ...approveData,
                  password: e.target.value,
                })
              }
            />

          </div>

        </CModalBody>

        <CModalFooter>

          <CButton
            color="secondary"
            onClick={() => setVisible(false)}
          >
            Cancelar
          </CButton>

          <CButton
            color="primary"
            onClick={submitApproval}
          >
            Crear usuario
          </CButton>

        </CModalFooter>

      </CModal>

    </div>

  )

}

export default AccessReq