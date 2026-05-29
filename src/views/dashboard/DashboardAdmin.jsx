import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../Styles/dashboard.css'

const DashboardAdmin = () => {

  const [kpiServidores, setKpiServidores] = useState({})
  const [kpiSolicitudes, setKpiSolicitudes] = useState({})
  const [ultimosServidores, setUltimosServidores] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {

      setLoading(true)

      const [resServ, resSol, resUlt] = await Promise.all([
        axios.get('http://localhost:3001/dashboard/kpis-servidores'),
        axios.get('http://localhost:3001/dashboard/kpis-solicitudes'),
        axios.get('http://localhost:3001/dashboard/ultimos-servidores'),
      ])

      setKpiServidores(resServ.data || {})
      setKpiSolicitudes(resSol.data || {})
      setUltimosServidores(resUlt.data || [])

    } catch (error) {
      console.error('Error dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard Infraestructura</h1>
        <p>Monitoreo general del sistema</p>
      </div>

      {loading && <p>Cargando datos...</p>}

      {/* SERVIDORES */}
      <section className="kpi-grid">

        <div className="kpi-card">
          <h3>Total Servidores</h3>
          <h1>{kpiServidores.totalServidores || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Activos</h3>
          <h1>{kpiServidores.activos || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Mantenimiento</h3>
          <h1>{kpiServidores.mantenimiento || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Caídos</h3>
          <h1>{kpiServidores.caidos || 0}</h1>
        </div>

      </section>

      {/* SOLICITUDES */}
      <section className="kpi-grid">

        <div className="kpi-card">
          <h3>Total Solicitudes</h3>
          <h1>{kpiSolicitudes.totalSolicitudes || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Pendientes</h3>
          <h1>{kpiSolicitudes.pendientes || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Aprobadas</h3>
          <h1>{kpiSolicitudes.aprobadas || 0}</h1>
        </div>

        <div className="kpi-card">
          <h3>Rechazadas</h3>
          <h1>{kpiSolicitudes.rechazadas || 0}</h1>
        </div>

      </section>

      {/* ULTIMOS SERVIDORES */}
      <section className="panel-card">

        <h3>Últimos servidores</h3>

        {ultimosServidores.length === 0 ? (
          <p>Sin datos</p>
        ) : (
          ultimosServidores.map((s) => (
            <div key={s.id}>
              <strong>{s.nombre}</strong>
              <p>{s.ip} - {s.sistema_operativo}</p>
            </div>
          ))
        )}

      </section>

    </div>
  )
}

export default DashboardAdmin