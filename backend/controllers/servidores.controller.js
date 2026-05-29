const db = require('../db')

const obtenerServidores = (req, res) => {

  const sql = `
    SELECT
      s.id_servidor,
      s.nombre,
      s.hostname,
      s.ip,
      s.mac,
      s.serial,
      s.sistema_operativo,
      s.version_so,
      s.fabricante,
      s.modelo,
      s.descripcion,
      s.fecha_registro,
      s.id_tipo,
      s.id_estado,
      s.id_ubicacion,

      e.nombre AS estado

    FROM servidores s

    LEFT JOIN estados e
      ON s.id_estado = e.id_estado
  `

  db.query(sql, (error, results) => {

    if (error) {

      console.error(error)

      return res.status(500).json({
        message: 'Error obteniendo servidores',
      })
    }

    res.json(results)
  })
}

const actualizarServidor = (req, res) => {

  const { id } = req.params

  const {
    nombre,
    ip,
    hostname,
    sistema_operativo,
    mac,
    serial,
    fabricante,
    modelo,
    descripcion,
    version_so,
    id_estado,
    id_tipo,
    id_ubicacion,
  } = req.body

  const sql = `
    UPDATE servidores
    SET
      nombre = ?,
      ip = ?,
      hostname = ?,
      sistema_operativo = ?,
      mac = ?,
      serial = ?,
      fabricante = ?,
      modelo = ?,
      descripcion = ?,
      version_so = ?,
      id_estado = ?,
      id_tipo = ?,
      id_ubicacion = ?
    WHERE id_servidor = ?
  `

  db.query(
    sql,
    [
      nombre,
      ip,
      hostname,
      sistema_operativo,
      mac,
      serial,
      fabricante,
      modelo,
      descripcion,
      version_so,
      id_estado,
      id_tipo,
      id_ubicacion,
      id,
    ],
    (error, result) => {

      if (error) {

        console.error(error)

        return res.status(500).json({
          message: 'Error actualizando servidor',
        })
      }

      res.json({
        message: 'Servidor actualizado correctamente',
      })
    }
  )
}

const eliminarServidor = (req, res) => {

  const { id } = req.params

  const sql = `
  UPDATE servidores
  SET id_estado = 4
  WHERE id_servidor = ?
`

  db.query(sql, [id], (error, result) => {

    if (error) {

      console.error(error)

      return res.status(500).json({
        message: 'Error desactivando servidor',
      })
    }

    res.json({
      message: 'Servidor desactivado correctamente',
    })
  })
}

const registrarServidor = (req, res) => {
console.log(req.body)
  const {
    serverName,
    description,
    ip,
    serverType,
    os,
    status,
    location,
    processor,
    ram,
    storage,
    owner,
  } = req.body

  const sql = `
    INSERT INTO servidores (
      nombre,
      descripcion,
      ip,
      sistema_operativo,
      fecha_registro,
      id_tipo,
      id_estado,
      id_ubicacion
    )
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)
  `

  db.query(
    sql,
    [
      serverName,
      description,
      ip,
      os,
      serverType || 1,
      status || 1,
      location || 1,
    ],
    (error, result) => {

      if (error) {

        console.error(error)

        return res.status(500).json({
          message: 'Error registrando servidor',
        })
      }

      res.status(201).json({
        message: 'Servidor registrado correctamente',
      })
    }
  )
}
module.exports = {
  obtenerServidores,
  actualizarServidor,
  eliminarServidor,
  registrarServidor,
}