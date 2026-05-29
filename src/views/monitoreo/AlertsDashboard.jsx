import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import axios from 'axios'

import '../../Styles/monitoreo.css'

import Swal from 'sweetalert2'

const AlertsDashboard = () => {

  const [alerts, setAlerts] = useState([])

  const [statusFilter, setStatusFilter] =
    useState('Todos')

  const [severityFilter, setSeverityFilter] =
    useState('Todos')

  const [search, setSearch] = useState('')

  // CARGAR ALERTAS
  useEffect(() => {

    fetchAlerts()

  }, [])

  const fetchAlerts = async () => {

    try {

      const response = await axios.get(
        'http://localhost:3001/api/alertas'
      )

      setAlerts(response.data)

    } catch (error) {

      console.log(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las alertas',
      })

    }

  }

  // FILTROS
  const filteredAlerts = useMemo(() => {

    return alerts.filter((alert) => {

      const matchesStatus =
        statusFilter === 'Todos' ||
        alert.estado === statusFilter

      const matchesSeverity =
        severityFilter === 'Todos' ||
        alert.severidad === severityFilter

      const matchesSearch =
        alert.titulo
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        alert.servidor
          ?.toLowerCase()
          .includes(search.toLowerCase())

      return (
        matchesStatus &&
        matchesSeverity &&
        matchesSearch
      )

    })

  }, [
    alerts,
    statusFilter,
    severityFilter,
    search,
  ])

  // ESTADÍSTICAS
  const stats = {

    criticas: alerts.filter(
      (a) => a.severidad === 'Crítica'
    ).length,

    advertencias: alerts.filter(
      (a) => a.severidad === 'Advertencia'
    ).length,

    informativas: alerts.filter(
      (a) => a.severidad === 'Informativa'
    ).length,

    resueltas: alerts.filter(
      (a) => a.estado === 'Leída'
    ).length,

  }

  // MARCAR TODAS
  const marcarTodasLeidas = async () => {

    try {

      await axios.put(
        'http://localhost:3001/api/alertas/marcar-leidas'
      )

      Swal.fire({
        icon: 'success',
        title: 'Alertas actualizadas',
      })

      fetchAlerts()

    } catch (error) {

      console.log(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron actualizar',
      })

    }

  }

  return (

    <div className="alerts-container">

      <div className="alerts-header">

        <div>

          <h2>
            Alertas
          </h2>

          <p>
            Visualiza y gestiona las alertas generadas por el sistema.
          </p>

        </div>

        <button
          className="mark-btn"
          onClick={marcarTodasLeidas}
        >
          Marcar todas como leídas
        </button>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <StatCard
          title="Críticas"
          value={stats.criticas}
          type="critical"
        />

        <StatCard
          title="Advertencias"
          value={stats.advertencias}
          type="warning"
        />

        <StatCard
          title="Informativas"
          value={stats.informativas}
          type="info"
        />

        <StatCard
          title="Resueltas hoy"
          value={stats.resueltas}
          type="success"
        />

      </div>

      {/* FILTROS */}

      <div className="filters">

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="Nuevo">
            Nuevo
          </option>

          <option value="En progreso">
            En progreso
          </option>

          <option value="Leída">
            Leída
          </option>

        </select>

        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(e.target.value)
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="Crítica">
            Crítica
          </option>

          <option value="Advertencia">
            Advertencia
          </option>

          <option value="Informativa">
            Informativa
          </option>

        </select>

        <input
          type="text"
          placeholder="Buscar alerta..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* TABLA */}

      <table className="alerts-table">

        <thead>

          <tr>

            <th>
              Severidad
            </th>

            <th>
              Alerta
            </th>

            <th>
              Servidor
            </th>

            <th>
              Tipo
            </th>

            <th>
              Fecha y hora
            </th>

            <th>
              Estado
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredAlerts.map((alert) => (

            <tr key={alert.id_alerta}>

              <td>

                <span
                  className={`badge ${(alert.severidad || 'informativa').toLowerCase()}`}
                >
                  {alert.severidad}
                </span>

              </td>

              <td>

                <strong>
                  {alert.titulo}
                </strong>

                <p>
                  {alert.descripcion}
                </p>

              </td>

              <td>
                {alert.servidor}
              </td>

              <td>
                {alert.tipo_alerta}
              </td>

              <td>
                {alert.fecha_generada}
              </td>

              <td>
                {alert.estado}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}

const StatCard = ({
  title,
  value,
  type,
}) => (

  <div className={`stat-card ${type}`}>

    <h4>
      {title}
    </h4>

    <span>
      {value}
    </span>

  </div>

)

export default AlertsDashboard