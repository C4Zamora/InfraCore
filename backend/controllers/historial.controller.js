const db = require('../db')

/**
 * Obtener historial de cambios con filtros y paginación
 */
const obtenerHistorial = (req, res) => {
  const {
    fechaDesde,
    fechaHasta,
    modulo,
    usuario,
    q,
    page = 1,
    perPage = 10,
    sortBy = 'fecha',
    sortDir = 'desc'
  } = req.query

  let whereClauses = []
  let params = []

  if (fechaDesde) {
    whereClauses.push('DATE(fecha) >= ?')
    params.push(fechaDesde)
  }

  if (fechaHasta) {
    whereClauses.push('DATE(fecha) <= ?')
    params.push(fechaHasta)
  }

  if (modulo && modulo !== 'Todos') {
    whereClauses.push('modulo = ?')
    params.push(modulo)
  }

  if (usuario && usuario !== 'Todos') {
    whereClauses.push('usuario LIKE ?')
    params.push(`%${usuario}%`)
  }

  if (q) {
    whereClauses.push('(descripcion LIKE ? OR usuario LIKE ? OR accion LIKE ? OR modulo LIKE ?)')
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  // Contar total
  const countSql = `SELECT COUNT(*) AS total FROM historial_cambios ${whereSql}`

  db.query(countSql, params, (countErr, countResult) => {
    if (countErr) {
      console.error('Error conteo historial:', countErr)
      return res.status(500).json({ message: 'Error al consultar historial' })
    }

    const total = countResult[0]?.total || 0
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(perPage, 10)
    const limit = parseInt(perPage, 10)

    const validSortFields = ['fecha', 'usuario', 'modulo', 'accion', 'id_historial']
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'fecha'
    const safeSortDir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const dataSql = `
      SELECT
        id_historial AS id,
        DATE_FORMAT(fecha, '%d/%m/%Y %H:%i:%s') AS fecha,
        usuario,
        modulo,
        accion,
        descripcion,
        ip
      FROM historial_cambios
      ${whereSql}
      ORDER BY ${safeSortBy} ${safeSortDir}
      LIMIT ? OFFSET ?
    `

    db.query(dataSql, [...params, limit, offset], (dataErr, records) => {
      if (dataErr) {
        console.error('Error obtención registros historial:', dataErr)
        return res.status(500).json({ message: 'Error al obtener registros de historial' })
      }

      res.json({
        total,
        registros: records
      })
    })
  })
}

/**
 * Función auxiliar para registrar cambios en auditoría desde otros controladores
 */
const registrarCambio = (usuario, modulo, accion, descripcion, ip = '127.0.0.1') => {
  const sql = `
    INSERT INTO historial_cambios (usuario, modulo, accion, descripcion, ip)
    VALUES (?, ?, ?, ?, ?)
  `
  db.query(sql, [usuario || 'sistema', modulo, accion, descripcion, ip], (err) => {
    if (err) console.error('Error registrando auditoría:', err.message)
  })
}

module.exports = {
  obtenerHistorial,
  registrarCambio
}
