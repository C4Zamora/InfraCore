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
  // CAMBIO 1: Extraer 'id_servidor' en lugar de 'id' para coincidir con la ruta de Express
  const { id_servidor } = req.params

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
    estado, // Recibimos el texto del Front por si acaso
    id_tipo,
    id_ubicacion,
  } = req.body

  // CAMBIO 2: Mapeo de seguridad por si desde el Front llega el texto en lugar del ID numérico
  let estadoFinalId = id_estado;
  if (!estadoFinalId && estado) {
    const mapaEstados = {
      'Activo': 1,
      'En mantenimiento': 2,
      'Caído': 3,
      'Inactivo': 4
    }
    estadoFinalId = mapaEstados[estado] || 1
  }

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
      estadoFinalId, // Usamos el ID numérico resuelto
      id_tipo || 1,
      id_ubicacion || 1,
      id_servidor, // Usamos la variable correcta del parámetro
    ],
    (error, result) => {
      if (error) {
        console.error(error)
        return res.status(500).json({
          message: 'Error actualizando servidor',
        })
      }

      // Validar si realmente se modificó una fila (por si el ID no existía)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Servidor no encontrado' })
      }

      res.json({
        message: 'Servidor actualizado correctamente',
      })
    }
  )
}

const eliminarServidor = (req, res) => {
  // CAMBIO 3: Cambiado 'id' por 'id_servidor'
  const { id_servidor } = req.params

  const sql = `
    UPDATE servidores
    SET id_estado = 4
    WHERE id_servidor = ?
  `

  db.query(sql, [id_servidor], (error, result) => {
    if (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Error desactivando servidor',
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servidor no encontrado' })
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