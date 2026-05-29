const db = require('../db')

const bcrypt = require('bcrypt')


// OBTENER PERFIL
const obtenerPerfil = (req, res) => {

  const { id } = req.params

  const sql = `
    SELECT
      u.id_usuario,
      u.nombre,
      u.apellido,
      u.correo,
      u.telefono,
      u.id_rol,
      r.nombre AS rol
    FROM usuarios u
    INNER JOIN roles r
      ON u.id_rol = r.id_rol
    WHERE u.id_usuario = ?
  `

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json(err)
    }

    if (result.length === 0) {

      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    res.json(result[0])
  })
}


// ACTUALIZAR PERFIL
const actualizarPerfil = (req, res) => {

  const { id } = req.params

  const {
    nombre,
    apellido,
    correo,
    telefono,
    id_rol,
  } = req.body

  const sql = `
    UPDATE usuarios
    SET
      nombre = ?,
      apellido = ?,
      correo = ?,
      telefono = ?,
      id_rol = ?
    WHERE id_usuario = ?
  `

  db.query(
    sql,
    [
      nombre,
      apellido,
      correo,
      telefono,
      id_rol,
      id,
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err)
      }

      res.json({
        message: 'Perfil actualizado',
      })
    }
  )
}


// ACTUALIZAR PASSWORD
const actualizarPassword = async (req, res) => {

  const { id } = req.params

  const { nueva } = req.body

  try {

    const passwordHash = await bcrypt.hash(nueva, 10)

    const sql = `
      UPDATE usuarios
      SET password_hash = ?
      WHERE id_usuario = ?
    `

    db.query(
      sql,
      [passwordHash, id],
      (err, result) => {

        if (err) {
          return res.status(500).json(err)
        }

        res.json({
          message: 'Contraseña actualizada',
        })
      }
    )

  } catch (error) {

    res.status(500).json(error)
  }
}


// EXPORTS
module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  actualizarPassword,
}