const db = require('../db');

const bcrypt = require('bcrypt');


// OBTENER SOLICITUDES
const obtenerSolicitudes = (req, res) => {

    const sql = `
    SELECT
        s.id_solicitud,
        s.nombre_completo,
        s.correo,
        s.area,
        s.justificacion,
        s.estado,
        s.fecha_solicitud,
        s.id_rol,

        r.nombre AS rol

    FROM solicitudes_acceso s

    INNER JOIN roles r
        ON s.id_rol = r.id_rol

    ORDER BY s.fecha_solicitud DESC
`;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};



// APROBAR SOLICITUD
const aprobarSolicitud = async (req, res) => {

    try {
        console.log('BODY RECIBIDO:')
console.log(req.body)

        const {
            id_solicitud,
            nombre,
            apellido,
            correo,
            password,
            id_rol
        } = req.body;

        // VALIDACIÓN
        if (
            !id_solicitud ||
            !nombre ||
            !apellido ||
            !correo ||
            !password ||
            !id_rol
        ) {

            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });

        }

        // VERIFICAR SI YA EXISTE
        const verificarCorreo = `
            SELECT id_usuario
            FROM usuarios
            WHERE correo = ?
        `;

        db.query(
            verificarCorreo,
            [correo],
            async (err, results) => {

                if (err) {
                    return res.status(500).json(err);
                }

                // YA EXISTE
                if (results.length > 0) {

                    return res.status(400).json({
                        message:
                            'Ya existe un usuario con este correo'
                    });

                }

                // HASH PASSWORD
                const passwordHash =
                    await bcrypt.hash(password, 10);

                // CREAR USUARIO
                const sqlUsuario = `
                    INSERT INTO usuarios (
    nombre,
    apellido,
    correo,
    telefono,
    password_hash,
    estado,
    fecha_creacion,
    id_rol
)
VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
                `;

                db.query(
                    sqlUsuario,
                    [
    nombre,
    apellido,
    correo,
    '',
    passwordHash,
    1,
    id_rol
],
       
                    (err2, result) => {

                        if (err2) {

                            console.log('ERROR INSERT USUARIO:')
                            console.log(err2)

                            return res.status(500).json(err2);

                        }

                        // ACTUALIZAR SOLICITUD
                        const sqlSolicitud = `
                             UPDATE solicitudes_acceso
                             SET estado = 'Aprobada'
                             WHERE id_solicitud = ?
                            `;

                        db.query(
                            sqlSolicitud,
                            [id_solicitud],
                            (err3) => {

                                if (err3) {

                                    console.log(err3);

                                    console.log('ERROR UPDATE SOLICITUD:')
                                    console.log(err3)

                                }

                                res.json({
                                    message:
                                        'Usuario creado correctamente'
                                });

                            }
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};



// RECHAZAR
const rechazarSolicitud = (req, res) => {

    const { id_solicitud } = req.body;

    const sql = `
        UPDATE solicitudes_acceso
        SET estado = 'Rechazada'
        WHERE id_solicitud = ?
    `;

    db.query(sql, [id_solicitud], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: 'Solicitud rechazada'
        });

    });

};
// OBTENER ROLES
const obtenerRoles = (req, res) => {

    const sql = `
        SELECT
            id_rol,
            nombre
        FROM roles
        WHERE estado = 1
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};


// CREAR SOLICITUD
const crearSolicitud = (req, res) => {

    const {
        fullName,
        email,
        area,
        justification,
        rol
    } = req.body;

    if (
        !fullName ||
        !email ||
        !area ||
        !justification ||
        !rol
    ) {

        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        });

    }

    const sql = `
        INSERT INTO solicitudes_acceso (
            nombre_completo,
            correo,
            area,
            justificacion,
            id_rol
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            fullName,
            email,
            area,
            justification,
            rol
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: 'Solicitud enviada correctamente',
                id: result.insertId
            });

        }
    );

};


module.exports = {
    obtenerSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud,
    obtenerRoles,
    crearSolicitud
};