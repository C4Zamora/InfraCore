const db = require('../db')

/*
|--------------------------------------------------------------------------
| KPI SERVIDORES
|--------------------------------------------------------------------------
*/
const getKpisServidores = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS totalServidores,
      SUM(CASE WHEN id_estado = 1 THEN 1 ELSE 0 END) AS activos,
      SUM(CASE WHEN id_estado = 2 THEN 1 ELSE 0 END) AS mantenimiento,
      SUM(CASE WHEN id_estado = 3 THEN 1 ELSE 0 END) AS caidos,
      SUM(CASE WHEN id_estado = 4 THEN 1 ELSE 0 END) AS inactivos
    FROM servidores
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error KPI Servidores:", err)
      return res.status(500).json({ message: 'Error en servidor' })
    }
    
    const row = results[0] || {}
    
    // Forzamos que todo sea un número entero limpio en la respuesta
    res.json({
      totalServidores: Number(row.totalServidores || 0),
      activos: Number(row.activos || 0),
      mantenimiento: Number(row.mantenimiento || 0),
      caidos: Number(row.caidos || 0),
      inactivos: Number(row.inactivos || 0)
    })
  })
}

/*
|--------------------------------------------------------------------------
| KPI SOLICITUDES
|--------------------------------------------------------------------------
*/
const getKpisSolicitudes = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS totalSolicitudes,
      SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
      SUM(CASE WHEN estado = 'Aprobada' THEN 1 ELSE 0 END) AS aprobadas,
      SUM(CASE WHEN estado = 'Rechazada' THEN 1 ELSE 0 END) AS rechazadas
    FROM solicitudes_acceso
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error KPI Solicitudes:", err)
      return res.status(500).json({ message: 'Error en solicitudes' })
    }
    
    const row = results[0] || {}
    
    res.json({
      totalSolicitudes: Number(row.totalSolicitudes || 0),
      pendientes: Number(row.pendientes || 0),
      aprobadas: Number(row.aprobadas || 0),
      rechazadas: Number(row.rechazadas || 0)
    })
  })
}

/*
|--------------------------------------------------------------------------
| ULTIMOS SERVIDORES
|--------------------------------------------------------------------------
*/
const getUltimosServidores = (req, res) => {
  const sql = `
    SELECT
      id_servidor AS id,
      nombre,
      ip,
      sistema_operativo,
      fecha_registro
    FROM servidores
    ORDER BY fecha_registro DESC
    LIMIT 5
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error Últimos Servidores:", err)
      return res.status(500).json({ message: 'Error en últimos servidores' })
    }
    // Aseguramos que siempre devuelva un array (aunque esté vacío)
    res.json(results || [])
  })
}

module.exports = {
  getKpisServidores,
  getKpisSolicitudes,
  getUltimosServidores,
}