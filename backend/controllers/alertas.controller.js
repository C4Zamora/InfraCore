const db = require('../db');


// OBTENER ALERTAS
const obtenerAlertas = (req, res) => {

    const sql = `
        SELECT
            a.id_alerta,
            a.titulo,
            a.descripcion,
            a.fecha_generada,
            a.fecha_resuelta,

            a.id_servidor,
            a.id_tipo_alerta,
            a.id_severidad,
            a.id_estado_alerta,

            s.nombre AS servidor,

            ta.nombre AS tipo_alerta,

            sev.nombre AS severidad,

            ea.nombre AS estado

        FROM alertas a

        LEFT JOIN servidores s
            ON a.id_servidor = s.id_servidor

        LEFT JOIN tipos_alerta ta
            ON a.id_tipo_alerta = ta.id_tipo_alerta

        LEFT JOIN severidades sev
            ON a.id_severidad = sev.id_severidad

        LEFT JOIN estados_alerta ea
            ON a.id_estado_alerta = ea.id_estado_alerta

        ORDER BY a.fecha_generada DESC
    `;

    db.query(sql, (err, results) => {

        // DEBUG
        console.log('========= ALERTAS =========');

        if (err) {

            console.log('ERROR SQL:', err);

            return res.status(500).json({
                message: 'Error al obtener alertas',
                error: err.sqlMessage
            });

        }

        console.log('RESULTADOS:', results);

        res.json(results);

    });

};


// MARCAR TODAS COMO LEÍDAS
const marcarTodasLeidas = (req, res) => {

    const sql = `
        UPDATE alertas
        SET
            id_estado_alerta = 3,
            fecha_resuelta = NOW()
        WHERE id_estado_alerta != 3
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log('ERROR UPDATE:', err);

            return res.status(500).json({
                message: 'Error al actualizar alertas',
                error: err.sqlMessage
            });

        }

        res.json({
            message: 'Alertas actualizadas correctamente',
            affectedRows: result.affectedRows
        });

    });

};


module.exports = {
    obtenerAlertas,
    marcarTodasLeidas
};