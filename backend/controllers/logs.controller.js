const db = require('../db')

/**
 * Obtener logs del sistema con filtros de nivel, servicio y búsqueda
 */
const obtenerLogs = (req, res) => {
  const {
    level,
    service,
    q,
    search,
    page = 1,
    perPage = 25
  } = req.query

  const term = q || search || ''
  let whereClauses = []
  let params = []

  if (level && level !== 'ALL') {
    whereClauses.push('level = ?')
    params.push(level)
  }

  if (service && service !== 'Todos') {
    whereClauses.push('service = ?')
    params.push(service)
  }

  if (term) {
    whereClauses.push('(message LIKE ? OR service LIKE ? OR metadata LIKE ?)')
    params.push(`%${term}%`, `%${term}%`, `%${term}%`)
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countSql = `SELECT COUNT(*) AS total FROM logs_sistema ${whereSql}`

  db.query(countSql, params, (countErr, countResult) => {
    if (countErr) {
      console.error('Error conteo logs:', countErr)
      return res.status(500).json({ message: 'Error al consultar logs' })
    }

    const total = countResult[0]?.total || 0
    const limit = parseInt(perPage, 10)
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * limit

    const dataSql = `
      SELECT
        id_log AS id,
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp,
        level,
        service,
        message,
        metadata
      FROM logs_sistema
      ${whereSql}
      ORDER BY id_log DESC
      LIMIT ? OFFSET ?
    `

    db.query(dataSql, [...params, limit, offset], (dataErr, rows) => {
      if (dataErr) {
        console.error('Error obtención logs:', dataErr)
        return res.status(500).json({ message: 'Error al obtener logs' })
      }

      // Parse metadata if JSON
      const parsedRows = rows.map(r => {
        let meta = null
        try {
          if (r.metadata) meta = JSON.parse(r.metadata)
        } catch (e) {
          meta = r.metadata
        }
        return {
          ...r,
          metadata: meta
        }
      })

      res.json({
        total,
        data: parsedRows,
        logs: parsedRows
      })
    })
  })
}

/**
 * Función auxiliar para registrar logs de sistema
 */
const registrarLog = (level, service, message, metadata = null) => {
  const metaStr = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata
  const sql = `
    INSERT INTO logs_sistema (level, service, message, metadata)
    VALUES (?, ?, ?, ?)
  `
  db.query(sql, [level.toUpperCase(), service, message, metaStr], (err) => {
    if (err) console.error('Error registrando log:', err.message)
  })
}

module.exports = {
  obtenerLogs,
  registrarLog
}
