const db = require('../db')
const bcrypt = require('bcrypt')
const { registrarCambio } = require('./historial.controller')

/* =========================
   OBTENER USUARIOS
========================= */

const obtenerUsuarios = (req, res) => {
  const sql = `
    SELECT
      u.id_usuario,
      u.nombre,
      u.apellido,
      u.correo,
      u.telefono,
      u.estado,
      CASE
        WHEN u.estado = 1 THEN 'Activo'
        ELSE 'Inactivo'
      END AS estado_texto,
      u.fecha_creacion,
      u.id_rol,
      r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r
      ON u.id_rol = r.id_rol
    ORDER BY u.id_usuario DESC
  `

  db.query(sql, (error, results) => {
    if (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Error obteniendo usuarios',
      })
    }

    res.json(results)
  })
}

/* =========================
   CREAR USUARIO
========================= */

const crearUsuario = async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    telefono,
    password,
    id_rol,
  } = req.body

  if (!nombre || !apellido || !correo || !password || !id_rol) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO usuarios (
        nombre,
        apellido,
        correo,
        telefono,
        password_hash,
        id_rol,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `

    db.query(
      sql,
      [nombre, apellido, correo, telefono || '', passwordHash, id_rol],
      (error, result) => {
        if (error) {
          console.error('ERROR MYSQL:', error)
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Ya existe un usuario registrado con este correo' })
          }
          return res.status(500).json({
            message: 'Error creando usuario',
          })
        }

        registrarCambio('admin', 'Usuarios', 'Creación', `Se creó el usuario ${nombre} ${apellido} (${correo})`)

        res.status(201).json({
          message: 'Usuario creado correctamente',
          id_usuario: result.insertId
        })
      }
    )
  } catch (err) {
    console.error('Error hash bcrypt:', err)
    res.status(500).json({ message: 'Error procesando credenciales' })
  }
}

/* =========================
   ACTUALIZAR USUARIO
========================= */

const actualizarUsuario = (req, res) => {
  const { id } = req.params

  const {
    nombre,
    apellido,
    correo,
    telefono,
    id_rol,
    estado,
  } = req.body

  const sql = `
    UPDATE usuarios
    SET
      nombre = ?,
      apellido = ?,
      correo = ?,
      telefono = ?,
      id_rol = ?,
      estado = ?
    WHERE id_usuario = ?
  `

  db.query(
    sql,
    [nombre, apellido, correo, telefono, id_rol, estado, id],
    (error, result) => {
      if (error) {
        console.error('ERROR MYSQL:', error)
        return res.status(500).json({
          message: 'Error actualizando usuario',
        })
      }

      registrarCambio('admin', 'Usuarios', 'Actualización', `Se actualizó el usuario ID: ${id} (${correo})`)

      res.json({
        message: 'Usuario actualizado correctamente',
      })
    }
  )
}

/* =========================
   DESHABILITAR USUARIO
========================= */

const eliminarUsuario = (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE usuarios
    SET estado = 0
    WHERE id_usuario = ?
  `

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error('ERROR DELETE:', error)
      return res.status(500).json({
        message: 'Error eliminando usuario',
      })
    }

    registrarCambio('admin', 'Usuarios', 'Desactivación', `Se deshabilitó el usuario ID: ${id}`)

    res.json({
      message: 'Usuario deshabilitado correctamente',
    })
  })
}

/* =========================
   CONTEO DE USUARIOS POR ROL
========================= */

const obtenerRolesConConteoUsuarios = (req, res) => {
  const sql = `
    SELECT 
      r.id_rol,
      r.nombre,
      r.descripcion,
      COUNT(u.id_usuario) AS usuarios
    FROM roles r
    LEFT JOIN usuarios u 
      ON u.id_rol = r.id_rol
      AND u.estado = 1
    WHERE r.estado = 1
    GROUP BY 
      r.id_rol,
      r.nombre,
      r.descripcion
    ORDER BY r.id_rol ASC
  `

  db.query(sql, (err, result) => {
    if (err) {
      console.error('ERROR ROLES:', err)
      return res.status(500).json({
        message: 'Error obteniendo conteo de roles',
        error: err.sqlMessage || err,
      })
    }

    res.json(result)
  })
}

/* =========================
   EXPORTS
========================= */

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRolesConConteoUsuarios,
}