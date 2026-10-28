const express = require('express')
const router = express.Router()

const {
  obtenerParametros,
  actualizarParametro
} = require('../controllers/parametros.controller')

router.get('/', obtenerParametros)
router.put('/:id', actualizarParametro)

module.exports = router
