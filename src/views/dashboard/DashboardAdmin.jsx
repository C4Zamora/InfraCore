import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CChart } from '@coreui/react-chartjs' // <-- Importamos el componente de gráficos
import '../../Styles/dashboard.css'

const DashboardAdmin = () => {
  const [kpiServidores, setKpiServidores] = useState({
    totalServidores: 0,
    activos: 0,
    mantenimiento: 0,
    caidos: 0,
    inactivos: 0
  })

  const [ultimosServidores, setUltimosServidores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {
      setLoading(true)

      const response = await axios.get('http://localhost:3001/api/servidores')
      const servidores = response.data || []

      // Cálculos de KPIs en Frontend
      const totalServidores = servidores.length
      const activos = servidores.filter(s => s.estado === 'Activo' || s.id_estado === 1).length
      const mantenimiento = servidores.filter(s => s.estado === 'En mantenimiento' || s.id_estado === 2).length
      const caidos = servidores.filter(s => s.estado === 'Caído' || s.id_estado === 3).length
      const inactivos = servidores.filter(s => s.estado === 'Inactivo' || s.id_estado === 4).length

      setKpiServidores({
        totalServidores,
        activos,
        mantenimiento,
        caidos,
        inactivos
      })

      const ordenados = [...servidores].sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
      setUltimosServidores(ordenados.slice(0, 5))

    } catch (error) {
      console.error('Error al procesar los datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="dashboard-header mb-4">
        <h1 className="fw-bold text-dark">Dashboard Infraestructura</h1>
        <p className="text-muted">Monitoreo y estado operativo del sistema en tiempo real</p>
      </div>

      {loading && <p className="text-primary fw-bold">Cargando métricas del sistema...</p>}

      {!loading && (
        <>
          {/* SECCIÓN PRINCIPAL: METRICAS Y GRÁFICO */}
          <div className="row g-4 mb-4">
            
            {/* COLUMNA DE LAS TARJETAS (IZQUIERDA) */}
            <div className="col-12 col-lg-7">
              <h2 className="fs-5 mb-3 fw-semibold text-secondary">Resumen de Estado</h2>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-4 bg-white rounded shadow-sm border-start border-primary border-4 h-100">
                    <span className="text-muted small fw-medium">Total Servidores</span>
                    <h2 className="fw-bold mt-1 mb-0 text-dark">{kpiServidores.totalServidores}</h2>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 bg-white rounded shadow-sm border-start border-success border-4 h-100">
                    <span className="text-muted small fw-medium">Servidores Activos</span>
                    <h2 className="fw-bold mt-1 mb-0 text-success">{kpiServidores.activos}</h2>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 bg-white rounded shadow-sm border-start border-warning border-4 h-100">
                    <span className="text-muted small fw-medium">En Mantenimiento</span>
                    <h2 className="fw-bold mt-1 mb-0 text-warning">{kpiServidores.mantenimiento}</h2>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 bg-white rounded shadow-sm border-start border-danger border-4 h-100">
                    <span className="text-muted small fw-medium">Servidores Caídos</span>
                    <h2 className="fw-bold mt-1 mb-0 text-danger">{kpiServidores.caidos}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DEL GRÁFICO (DERECHA) */}
            <div className="col-12 col-lg-5">
              <h2 className="fs-5 mb-3 fw-semibold text-secondary">Distribución Operativa</h2>
              <div className="p-4 bg-white rounded shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '280px' }}>
                
                {kpiServidores.totalServidores === 0 ? (
                  <p className="text-muted my-auto">Sin datos suficientes para graficar</p>
                ) : (
                  <div style={{ width: '100%', maxWidth: '240px' }}>
                    <CChart
                      type="doughnut" // Tipo Dona (puedes cambiarlo a "pie" si prefieres círculo completo)
                      data={{
                        labels: ['Activos', 'Mantenimiento', 'Caídos', 'Inactivos'],
                        datasets: [
                          {
                            backgroundColor: ['#2eb85c', '#f9b115', '#e55353', '#4f5d73'], // Colores oficiales de CoreUI
                            hoverBackgroundColor: ['#1b9e47', '#df9b09', '#d43f3f', '#3c4b5f'],
                            data: [
                              kpiServidores.activos, 
                              kpiServidores.mantenimiento, 
                              kpiServidores.caidos, 
                              kpiServidores.inactivos
                            ],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom', // Coloca las etiquetas abajo para que se vea ordenado
                            labels: {
                              boxWidth: 12,
                              font: { size: 12 }
                            }
                          },
                        },
                        maintainAspectRatio: true,
                      }}
                    />
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* ÚLTIMOS SERVIDORES AGREGADOS */}
          <div className="row">
            <div className="col-12">
              <div className="p-4 bg-white rounded shadow-sm border-0">
                <h3 className="fs-5 fw-bold mb-3 text-dark">Últimos 5 Servidores Agregados</h3>

                {ultimosServidores.length === 0 ? (
                  <p className="text-muted mb-0">No hay servidores registrados en el sistema.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Nombre</th>
                          <th>Dirección IP</th>
                          <th>Sistema Operativo</th>
                          <th className="text-end">Fecha de Registro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ultimosServidores.map((s) => (
                          <tr key={s.id_servidor || s.id}>
                            <td className="fw-semibold text-dark">{s.nombre}</td>
                            <td className="text-muted">{s.ip}</td>
                            <td>
                              <span className="badge bg-secondary text-white fw-normal">
                                {s.sistema_operativo || 'No especificado'}
                              </span>
                            </td>
                            <td className="text-end text-muted small">
                              {s.fecha_registro ? new Date(s.fecha_registro).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardAdmin