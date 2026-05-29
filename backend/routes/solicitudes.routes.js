const express = require('express');

const router = express.Router();

const {
    obtenerSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud,
    obtenerRoles,
    crearSolicitud
} = require('../controllers/solicitudes.controller');


// LISTAR SOLICITUDES
router.get('/', obtenerSolicitudes);

// OBTENER ROLES
router.get('/roles', obtenerRoles);

// CREAR SOLICITUD
router.post('/crear', crearSolicitud);

// APROBAR
router.post('/aprobar', aprobarSolicitud);

// RECHAZAR
router.post('/rechazar', rechazarSolicitud);

module.exports = router;