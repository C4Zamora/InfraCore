const db = require('../db')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const login = (req, res) => {

  const { correo, password } = req.body

  if (!correo || !password) {

    return res.status(400).json({
      message: 'Faltan credenciales'
    })
  }

  const sql = `
    SELECT *
    FROM usuarios
    WHERE correo = ?
  `

  db.query(sql, [correo], async (err, results) => {

    if (err) {

      return res.status(500).json(err)
    }

    if (results.length === 0) {

      return res.status(401).json({
        message: 'Usuario no encontrado'
      })
    }

    const usuario = results[0]

    console.log(usuario)

    // =========================
    // VALIDAR ESTADO
    // =========================

    if (parseInt(usuario.estado) === 0) {

      return res.status(403).json({
        message: 'Usuario inactivo. Contacte al administrador.'
      })
    }

    // =========================
    // VALIDAR PASSWORD (HASH)
    // =========================

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash
    )

    if (!passwordValida) {

      return res.status(401).json({
        message: 'Contraseña incorrecta'
      })
    }

    // =========================
    // VALIDAR JWT SECRET
    // =========================

    if (!process.env.JWT_SECRET) {

      return res.status(500).json({
        message: 'JWT_SECRET no configurado'
      })
    }

    // =========================
    // GENERAR TOKEN
    // =========================

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.id_rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    )

    // =========================
    // RESPUESTA
    // =========================

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        id_rol: usuario.id_rol
      }
    })

  })
}

module.exports = { login }