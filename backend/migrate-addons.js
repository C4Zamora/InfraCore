const mysql = require('mysql2/promise')
require('dotenv').config({ path: './.env', override: true })

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'infracore',
    multipleStatements: true
  })

  console.log('Conectado a MySQL para migración de tablas adicionales...')

  const sql = `
  CREATE TABLE IF NOT EXISTS \`historial_cambios\` (
    \`id_historial\` INT AUTO_INCREMENT PRIMARY KEY,
    \`fecha\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`usuario\` VARCHAR(100) NOT NULL,
    \`modulo\` VARCHAR(100) NOT NULL,
    \`accion\` VARCHAR(100) NOT NULL,
    \`descripcion\` TEXT NOT NULL,
    \`ip\` VARCHAR(50) NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS \`logs_sistema\` (
    \`id_log\` INT AUTO_INCREMENT PRIMARY KEY,
    \`timestamp\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`level\` VARCHAR(20) NOT NULL,
    \`service\` VARCHAR(50) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`metadata\` TEXT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS \`parametros_sistema\` (
    \`id_parametro\` INT AUTO_INCREMENT PRIMARY KEY,
    \`clave\` VARCHAR(100) NOT NULL UNIQUE,
    \`valor\` TEXT NOT NULL,
    \`categoria\` VARCHAR(50) NOT NULL,
    \`descripcion\` VARCHAR(255) NULL,
    \`fecha_actualizacion\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  -- Semilla para historial_cambios si está vacía
  INSERT IGNORE INTO \`historial_cambios\` (\`id_historial\`, \`fecha\`, \`usuario\`, \`modulo\`, \`accion\`, \`descripcion\`, \`ip\`) VALUES
  (1, NOW() - INTERVAL 2 HOUR, 'admin@infracore.com', 'Servidores', 'Actualización', 'Se actualizó el estado del servidor SRV-WEB-NGINX01 a En mantenimiento', '192.168.1.100'),
  (2, NOW() - INTERVAL 4 HOUR, 'admin@infracore.com', 'Usuarios', 'Creación', 'Se creó el usuario tecnico@infracore.com con rol Técnico', '192.168.1.100'),
  (3, NOW() - INTERVAL 6 HOUR, 'tecnico@infracore.com', 'Servidores', 'Registro', 'Se registró el servidor SRV-STORAGE-NAS en ubicación Medellín', '192.168.1.105'),
  (4, NOW() - INTERVAL 8 HOUR, 'admin@infracore.com', 'Solicitudes', 'Aprobación', 'Se aprobó la solicitud de acceso para Carlos Gómez', '192.168.1.100'),
  (5, NOW() - INTERVAL 12 HOUR, 'sistema', 'Alertas', 'Generación', 'Alerta crítica generada: Uso de CPU elevado en SRV-DEV-TEST01', '127.0.0.1'),
  (6, NOW() - INTERVAL 1 DAY, 'sistema', 'Backups', 'Ejecución', 'Backup diario de base de datos MySQL ejecutado exitosamente', '127.0.0.1');

  -- Semilla para logs_sistema si está vacía
  INSERT IGNORE INTO \`logs_sistema\` (\`id_log\`, \`timestamp\`, \`level\`, \`service\`, \`message\`, \`metadata\`) VALUES
  (1, NOW() - INTERVAL 5 MINUTE, 'INFO', 'Auth', 'Inicio de sesión exitoso para usuario admin@infracore.com', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0"}'),
  (2, NOW() - INTERVAL 15 MINUTE, 'WARN', 'Servidores', 'Latencia elevada detectada en enlace con Datacenter Principal (>85ms)', '{"host":"192.168.1.10","latencyMs":89}'),
  (3, NOW() - INTERVAL 35 MINUTE, 'ERROR', 'Sistema', 'Fallo temporal en resolución de nombres DNS secundario 192.168.1.254', '{"dns":"192.168.1.254","code":"ETIMEDOUT"}'),
  (4, NOW() - INTERVAL 1 HOUR, 'INFO', 'API Gateway', 'Petición GET /api/servidores completada en 12ms', '{"status":200,"size":1420}'),
  (5, NOW() - INTERVAL 2 HOUR, 'DEBUG', 'Base de datos', 'Pool de conexiones MySQL: 2 activas, 8 inactivas', '{"active":2,"idle":8}'),
  (6, NOW() - INTERVAL 3 HOUR, 'WARN', 'Alertas', 'Umbral de memoria advertencia alcanzado en SRV-PROD-APP01 (88%)', '{"srv":"SRV-PROD-APP01","memPct":88}');

  -- Semilla para parametros_sistema si está vacía
  INSERT IGNORE INTO \`parametros_sistema\` (\`id_parametro\`, \`clave\`, \`valor\`, \`categoria\`, \`descripcion\`) VALUES
  (1, 'app_name', 'InfraCore Enterprise', 'General', 'Nombre visible de la plataforma corporativa'),
  (2, 'alert_cpu_threshold', '90', 'Monitoreo', 'Umbral de alerta crítica de CPU en porcentaje'),
  (3, 'alert_ram_threshold', '85', 'Monitoreo', 'Umbral de alerta crítica de memoria RAM en porcentaje'),
  (4, 'smtp_host', 'smtp.infracore.local', 'Notificaciones', 'Servidor SMTP para notificaciones por correo'),
  (5, 'smtp_port', '587', 'Notificaciones', 'Puerto del servidor SMTP'),
  (6, 'session_timeout_hours', '8', 'Seguridad', 'Tiempo de expiración de sesiones JWT en horas'),
  (7, 'maintenance_mode', 'false', 'Mantenimiento', 'Activar modo de mantenimiento en la plataforma');
  `

  await conn.query(sql)
  console.log('✅ Tablas adicionales y datos semilla creados con éxito.')
  await conn.end()
}

migrate().catch(err => {
  console.error('Error en migración:', err)
  process.exit(1)
})
