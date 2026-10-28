const express = require('express')
const router = express.Router()

const {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
} = require('../controllers/roles.controller')

router.get('/', obtenerRoles)
router.post('/', crearRol)
router.put('/:id', actualizarRol)
router.delete('/:id', eliminarRol)

module.exports = router