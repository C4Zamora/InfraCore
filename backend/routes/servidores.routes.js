const express = require('express')

const router = express.Router()

const {
  obtenerServidores,
  actualizarServidor,
  eliminarServidor,
  registrarServidor,

} = require('../controllers/servidores.controller')

router.get('/', obtenerServidores)

router.put('/:id', actualizarServidor)

router.delete('/:id', eliminarServidor)
router.post('/', registrarServidor)


module.exports = router