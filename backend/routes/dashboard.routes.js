const express = require('express')
const router = express.Router()

const {
  getKpisServidores,
  getKpisSolicitudes,
  getUltimosServidores,
} = require('../controllers/dashboard.controller')

/*
|--------------------------------------------------------------------------
| DASHBOARD ROUTES
|--------------------------------------------------------------------------
*/

router.get('/kpis-servidores', getKpisServidores)
router.get('/kpis-solicitudes', getKpisSolicitudes)
router.get('/ultimos-servidores', getUltimosServidores)

module.exports = router