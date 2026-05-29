const express = require('express')

const router = express.Router()

const {
  obtenerPerfil,
  actualizarPerfil,
  actualizarPassword,
} = require('../controllers/profileController')

router.get(
  '/profile/:id',
  obtenerPerfil
)

router.put(
  '/profile/:id',
  actualizarPerfil
)

router.put(
  '/profile/password/:id',
  actualizarPassword
)

module.exports = router