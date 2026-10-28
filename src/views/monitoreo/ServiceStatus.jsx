import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
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

const TIPOS_MAP = {
  1: 'Aplicaciones',
  2: 'Base de datos',
  3: 'Web',
  4: 'Archivos'
}

const UBICACIONES_MAP = {
  1: 'Bogotá',
  2: 'Medellín',
  3: 'Cali',
  4: 'Barranquilla',
  5: 'Datacenter Principal'
}

const ServiceStatus = () => {
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [serviceType, setServiceType] = useState('Todos')

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:3001/api/servidores')
      const normalized = (res.data || []).map(s => ({
        id: s.id_servidor,
        servidor: s.nombre,
        ip: s.ip,
        tipo: TIPOS_MAP[s.id_tipo] || s.tipo || 'General',
        ubicacion: UBICACIONES_MAP[s.id_ubicacion] || s.ubicacion || 'Principal',
        estado: s.estado || (s.id_estado === 1 ? 'Activo' : s.id_estado === 2 ? 'En mantenimiento' : s.id_estado === 3 ? 'Caído' : 'Inactivo'),
        ultimoCambio: s.fecha_registro ? new Date(s.fecha_registro).toLocaleString('es-CO') : 'Reciente'
      }))
      setServicesData(normalized)
    } catch (err) {
      console.error('Error al cargar servicios:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Dynamic stats calculation
  const stats = useMemo(() => {
    const total = servicesData.length
    const activos = servicesData.filter(s => s.estado === 'Activo').length
    const mantenimiento = servicesData.filter(s => s.estado === 'En mantenimiento').length
    const caidos = servicesData.filter(s => s.estado === 'Caído').length

    return [
      {
        id: 1,
        title: 'Activos',
        value: activos,
        percentage: total > 0 ? `${Math.round((activos / total) * 100)}%` : '0%',
        color: 'green',
      },
      {
        id: 2,
        title: 'En mantenimiento',
        value: mantenimiento,
        percentage: total > 0 ? `${Math.round((mantenimiento / total) * 100)}%` : '0%',
        color: 'orange',
      },
      {
        id: 3,
        title: 'Caídos',
        value: caidos,
        percentage: total > 0 ? `${Math.round((caidos / total) * 100)}%` : '0%',
        color: 'red',
      },
      {
        id: 4,
        title: 'Total Servidores',
        value: total,
        percentage: '100%',
        color: 'blue',
      },
    ]
  }, [servicesData])

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        service.servidor.toLowerCase().includes(search.toLowerCase()) ||
        service.ip.includes(search)

      const matchesStatus =
        statusFilter === 'Todos' || service.estado === statusFilter

      const matchesType =
        serviceType === 'Todos' || service.tipo === serviceType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [servicesData, search, statusFilter, serviceType])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Activo':
        return 'status-active'
      case 'En mantenimiento':
        return 'status-maintenance'
      case 'Caído':
        return 'status-down'
      default:
        return 'status-inactive'
    }
  }

  const handleRefresh = () => {
    fetchServices()
  }

  return (
    <div className="services-container">
      <div className="services-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="services-title">
            Estado de servicios en vivo
          </h3>
          <p className="services-subtitle text-muted mb-0">
            Monitorea el estado y salud operativa de todos los servidores registrados en tiempo real.
          </p>
        </div>

        <CButton color="primary" variant="outline" onClick={handleRefresh} disabled={loading}>
          <CIcon icon={cilLoopCircular} className={`me-2 ${loading ? 'rotate' : ''}`} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </CButton>
      </div>

      <CRow className="g-4 mb-4">
        {stats.map((stat) => (
          <CCol md={6} xl={3} key={stat.id}>
            <CCard className="stats-card">
              <CCardBody>
                <div className="stats-content">
                  <div className={`stats-icon ${stat.color}`} />
                  <div>
                    <p className="stats-title">{stat.title}</p>
                    <h3 className="stats-value">{stat.value}</h3>
                    <span className="stats-percentage">{stat.percentage}</span>
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
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos">Estado: Todos</option>
                <option value="Activo">Activo</option>
                <option value="En mantenimiento">En mantenimiento</option>
                <option value="Caído">Caído</option>
                <option value="Inactivo">Inactivo</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect
                className="custom-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="Todos">Tipo: Todos</option>
                <option value="Aplicaciones">Aplicaciones</option>
                <option value="Base de datos">Base de datos</option>
                <option value="Web">Web</option>
                <option value="Archivos">Archivos</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CInputGroup>
                <CFormInput
                  placeholder="Buscar por servidor o dirección IP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CTable responsive align="middle" hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Servidor</CTableHeaderCell>
                <CTableHeaderCell>IP</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Ubicación</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Última Actualización</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading && (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-4">
                    Cargando servidores en tiempo real...
                  </CTableDataCell>
                </CTableRow>
              )}

              {!loading && filteredServices.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
                    No se encontraron servidores que coincidan con los filtros.
                  </CTableDataCell>
                </CTableRow>
              )}

              {!loading && filteredServices.map((service) => (
                <CTableRow key={service.id}>
                  <CTableDataCell>
                    <span className="service-name font-semibold">{service.servidor}</span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <code className="text-primary">{service.ip}</code>
                  </CTableDataCell>
                  <CTableDataCell>{service.tipo}</CTableDataCell>
                  <CTableDataCell>{service.ubicacion}</CTableDataCell>
                  <CTableDataCell>
                    <div className={`status-badge ${getStatusClass(service.estado)}`}>
                      <span className="status-dot" />
                      {service.estado}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-muted text-sm">{service.ultimoCambio}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="table-footer mt-3 d-flex justify-content-between align-items-center">
            <span className="text-muted text-sm">
              Mostrando {filteredServices.length} de {servicesData.length} servidores
            </span>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ServiceStatus