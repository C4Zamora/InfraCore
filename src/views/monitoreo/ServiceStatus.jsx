import React, { useMemo, useState } from 'react'
import '../../Styles/monitoreo.css'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cilCloudDownload,
  cilLoopCircular,
  cilSearch,
} from '@coreui/icons'

const servicesData = [
  {
    id: 1,
    servidor: 'SRV-APP-01',
    ip: '192.168.1.10',
    tipo: 'Aplicación',
    ubicacion: 'Datacenter Principal',
    estado: 'Activo',
    ultimoCambio: '10/05/2024 09:30',
  },

  {
    id: 2,
    servidor: 'SRV-DB-02',
    ip: '192.168.1.11',
    tipo: 'Base de datos',
    ubicacion: 'Datacenter Principal',
    estado: 'En mantenimiento',
    ultimoCambio: '10/05/2024 08:15',
  },

  {
    id: 3,
    servidor: 'SRV-WEB-03',
    ip: '192.168.1.12',
    tipo: 'Web',
    ubicacion: 'Sucursal Norte',
    estado: 'Caído',
    ultimoCambio: '10/05/2024 09:45',
  },

  {
    id: 4,
    servidor: 'SRV-FILES-04',
    ip: '192.168.1.13',
    tipo: 'Almacenamiento',
    ubicacion: 'Sucursal Sur',
    estado: 'Activo',
    ultimoCambio: '10/05/2024 09:00',
  },

  {
    id: 5,
    servidor: 'SRV-DEV-05',
    ip: '192.168.1.14',
    tipo: 'Desarrollo',
    ubicacion: 'Sucursal Este',
    estado: 'Activo',
    ultimoCambio: '10/05/2024 08:50',
  },
]

const stats = [
  {
    id: 1,
    title: 'Activos',
    value: 98,
    percentage: '81.7%',
    color: 'green',
  },

  {
    id: 2,
    title: 'En mantenimiento',
    value: 12,
    percentage: '10.0%',
    color: 'orange',
  },

  {
    id: 3,
    title: 'Caídos',
    value: 4,
    percentage: '3.3%',
    color: 'red',
  },

  {
    id: 4,
    title: 'Total',
    value: 120,
    percentage: '100%',
    color: 'blue',
  },
]

const ServiceStatus = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('Todos')

  const [serviceType, setServiceType] =
    useState('Todos')

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        service.servidor
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        service.ip.includes(search)

      const matchesStatus =
        statusFilter === 'Todos' ||
        service.estado === statusFilter

      const matchesType =
        serviceType === 'Todos' ||
        service.tipo === serviceType

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      )
    })
  }, [search, statusFilter, serviceType])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Activo':
        return 'status-active'

      case 'En mantenimiento':
        return 'status-maintenance'

      case 'Caído':
        return 'status-down'

      default:
        return ''
    }
  }

  const handleRefresh = () => {
    console.log('Actualizar servicios')
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <div>
          <h3 className="services-title">
            Estado de servicios
          </h3>

          <p className="services-subtitle">
            Monitorea el estado actual de todos los servidores y servicios.
          </p>
        </div>
      </div>

      <CRow className="g-4 mb-4">
        {stats.map((stat) => (
          <CCol
            md={6}
            xl={3}
            key={stat.id}
          >
            <CCard className="stats-card">
              <CCardBody>
                <div className="stats-content">
                  <div
                    className={`stats-icon ${stat.color}`}
                  />

                  <div>
                    <p className="stats-title">
                      {stat.title}
                    </p>

                    <h3 className="stats-value">
                      {stat.value}
                    </h3>

                    <span className="stats-percentage">
                      {stat.percentage}
                    </span>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard className="services-card">
        <CCardBody>
          <CRow className="g-3 mb-4">
            <CCol md={3}>
              <CFormSelect
                className="custom-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="Todos">
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
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect
                className="custom-select"
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
              >
                <option value="Todos">
                  Tipo de servicio: Todos
                </option>

                <option value="Aplicación">
                  Aplicación
                </option>

                <option value="Base de datos">
                  Base de datos
                </option>

                <option value="Web">
                  Web
                </option>

                <option value="Almacenamiento">
                  Almacenamiento
                </option>
              </CFormSelect>
            </CCol>

            <CCol md={4}>
              <CInputGroup>
                <span className="input-group-text search-icon">
                  <CIcon icon={cilSearch} />
                </span>

                <CFormInput
                  placeholder="Buscar servidor..."
                  className="custom-input"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </CInputGroup>
            </CCol>

            <CCol md={2}>
              <CButton
                className="refresh-btn"
                onClick={handleRefresh}
              >
                <CIcon
                  icon={cilLoopCircular}
                  className="me-2"
                />

                Actualizar
              </CButton>
            </CCol>
          </CRow>

          <CTable
            hover
            responsive
            align="middle"
            className="services-table"
          >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>
                  Nombre del servidor
                </CTableHeaderCell>

                <CTableHeaderCell>
                  IP
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Tipo de servicio
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Ubicación
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Estado
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Último cambio
                </CTableHeaderCell>

                <CTableHeaderCell className="text-center">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filteredServices.map((service) => (
                <CTableRow key={service.id}>
                  <CTableDataCell className="server-name">
                    {service.servidor}
                  </CTableDataCell>

                  <CTableDataCell>
                    {service.ip}
                  </CTableDataCell>

                  <CTableDataCell>
                    {service.tipo}
                  </CTableDataCell>

                  <CTableDataCell>
                    {service.ubicacion}
                  </CTableDataCell>

                  <CTableDataCell>
                    <div
                      className={`status-badge ${getStatusClass(
                        service.estado,
                      )}`}
                    >
                      <span className="status-dot" />

                      {service.estado}
                    </div>
                  </CTableDataCell>

                  <CTableDataCell>
                    {service.ultimoCambio}
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="actions-container">
                      <button className="table-action-btn">
                        <CIcon
                          icon={cilCloudDownload}
                        />
                      </button>

                      <button className="table-action-btn">
                        <CIcon
                          icon={cilSearch}
                        />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="table-footer">
            <span>
              Mostrando 1 a {filteredServices.length} de{' '}
              {servicesData.length} servicios
            </span>

            <div className="pagination-container">
              <button className="pagination-btn">
                {'<'}
              </button>

              <button className="pagination-btn active-page">
                1
              </button>

              <button className="pagination-btn">
                2
              </button>

              <button className="pagination-btn">
                3
              </button>

              <button className="pagination-btn">
                {'>'}
              </button>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ServiceStatus