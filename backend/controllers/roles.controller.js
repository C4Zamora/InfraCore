const db = require('../db')
const { registrarCambio } = require('./historial.controller')

/**
 * Obtener todos los roles activos
 */
const obtenerRoles = (req, res) => {
  const sql = `
    SELECT
      id_rol,
      nombre,
      nombre_rol,
      descripcion,
      estado
    FROM roles
    WHERE estado = 1
    ORDER BY id_rol ASC
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener roles:', err)
      return res.status(500).json({ message: 'Error obteniendo roles' })
    }
    res.json(results)
  })
}

/**
 * Crear un nuevo rol
 */
const crearRol = (req, res) => {
  const { nombre, descripcion } = req.body

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ message: 'El nombre del rol es obligatorio' })
  }

  const sqlCheck = 'SELECT id_rol FROM roles WHERE nombre = ?'
  db.query(sqlCheck, [nombre.trim()], (errCheck, existing) => {
    if (errCheck) return res.status(500).json(errCheck)
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ya existe un rol con este nombre' })
    }

    const sqlInsert = `
      INSERT INTO roles (nombre, nombre_rol, descripcion, estado)
      VALUES (?, ?, ?, 1)
    `
    db.query(sqlInsert, [nombre.trim(), nombre.trim(), descripcion || ''], (errInsert, result) => {
      if (errInsert) {
        console.error('Error creando rol:', errInsert)
        return res.status(500).json({ message: 'Error creando rol' })
      }

      registrarCambio('admin', 'Roles y permisos', 'Creación', `Se creó el nuevo rol: ${nombre.trim()}`)

      res.status(201).json({
        message: 'Rol creado exitosamente',
        id_rol: result.insertId
      })
    })
  })
}

/**
 * Actualizar rol existente
 */
const actualizarRol = (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ message: 'El nombre del rol es obligatorio' })
  }

  const sql = `
    UPDATE roles
    SET nombre = ?, nombre_rol = ?, descripcion = ?
    WHERE id_rol = ?
  `
  db.query(sql, [nombre.trim(), nombre.trim(), descripcion || '', id], (err, result) => {
    if (err) {
      console.error('Error actualizando rol:', err)
      return res.status(500).json({ message: 'Error actualizando rol' })
    }

    registrarCambio('admin', 'Roles y permisos', 'Actualización', `Se actualizó el rol ID: ${id} a "${nombre.trim()}"`)

    res.json({ message: 'Rol actualizado correctamente' })
  })
}

/**
 * Deshabilitar rol (baja lógica)
 */
const eliminarRol = (req, res) => {
  const { id } = req.params

  // No permitir borrar los 3 roles fundamentales del sistema
  if (['1', '2', '3'].includes(String(id))) {
    return res.status(403).json({ message: 'No es posible eliminar los roles principales del sistema' })
  }

  // Verificar si hay usuarios asignados a este rol
  const sqlCheck = 'SELECT COUNT(*) AS total FROM usuarios WHERE id_rol = ? AND estado = 1'
  db.query(sqlCheck, [id], (checkErr, checkResult) => {
    if (checkErr) return res.status(500).json(checkErr)

    if (checkResult[0]?.total > 0) {
      return res.status(400).json({
        message: `No se puede eliminar el rol porque tiene ${checkResult[0].total} usuario(s) asignado(s)`
      })
    }

    const sqlDelete = 'UPDATE roles SET estado = 0 WHERE id_rol = ?'
    db.query(sqlDelete, [id], (delErr) => {
      if (delErr) return res.status(500).json(delErr)

      registrarCambio('admin', 'Roles y permisos', 'Eliminación', `Se desactivó el rol ID: ${id}`)
      res.json({ message: 'Rol eliminado correctamente' })
    })
  })
}

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
}
