const express = require('express');

const router = express.Router();

const {
    obtenerAlertas,
    marcarTodasLeidas
} = require('../controllers/alertas.controller');


// OBTENER ALERTAS
router.get('/', obtenerAlertas);


// MARCAR LEÍDAS
router.put('/marcar-leidas', marcarTodasLeidas);


module.exports = router;