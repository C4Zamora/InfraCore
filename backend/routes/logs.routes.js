const express = require('express')
const router = express.Router()

const { obtenerLogs } = require('../controllers/logs.controller')

router.get('/', obtenerLogs)

module.exports = router
