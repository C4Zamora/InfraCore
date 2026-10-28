const db = require('../db')
const { registrarCambio } = require('./historial.controller')

/**
 * Obtener todos los parámetros del sistema
 */
const obtenerParametros = (req, res) => {
  const sql = `
    SELECT
      id_parametro,
      clave,
      valor,
      categoria,
      descripcion,
      fecha_actualizacion
    FROM parametros_sistema
    ORDER BY categoria ASC, clave ASC
  `
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener parámetros:', err)
      return res.status(500).json({ message: 'Error al obtener parámetros' })
    }
    res.json(results)
  })
}

/**
 * Actualizar valor de un parámetro
 */
const actualizarParametro = (req, res) => {
  const { id } = req.params
  const { valor } = req.body

  if (valor === undefined) {
    return res.status(400).json({ message: 'El valor es requerido' })
  }

  const sql = 'UPDATE parametros_sistema SET valor = ? WHERE id_parametro = ? OR clave = ?'
  db.query(sql, [valor, id, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar parámetro:', err)
      return res.status(500).json({ message: 'Error al actualizar parámetro' })
    }

    registrarCambio('admin', 'Configuración', 'Actualización', `Se actualizó el parámetro "${id}" al valor: ${valor}`)

    res.json({ message: 'Parámetro actualizado correctamente' })
  })
}

module.exports = {
  obtenerParametros,
  actualizarParametro
}
