const express = require('express')

const router = express.Router()

const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRolesConConteoUsuarios,
} = require('../controllers/usuarios.controller')

router.get('/', obtenerUsuarios)

router.post('/', crearUsuario)

router.put('/:id', actualizarUsuario)

router.delete('/:id', eliminarUsuario)
router.get('/roles/conteo', obtenerRolesConConteoUsuarios)

module.exports = router