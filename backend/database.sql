-- ===================================================
-- InfraCore - Database Schema & Initial Data
-- Base de Datos MySQL para Gestión de Infraestructura
-- ===================================================

CREATE DATABASE IF NOT EXISTS `infracore` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `infracore`;

-- Desactivar temporalmente revisión de claves foráneas para recreación limpia
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `alertas`;
DROP TABLE IF EXISTS `solicitudes_acceso`;
DROP TABLE IF EXISTS `servidores`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `estados`;
DROP TABLE IF EXISTS `tipos_servidor`;
DROP TABLE IF EXISTS `ubicaciones`;
DROP TABLE IF EXISTS `tipos_alerta`;
DROP TABLE IF EXISTS `severidades`;
DROP TABLE IF EXISTS `estados_alerta`;

SET FOREIGN_KEY_CHECKS = 1;

-- ===================================================
-- 1. TABLA: roles
-- ===================================================
CREATE TABLE `roles` (
  `id_rol` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `nombre_rol` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `estado` TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 2. TABLA: usuarios
-- ===================================================
CREATE TABLE `usuarios` (
  `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(150) NOT NULL UNIQUE,
  `telefono` VARCHAR(50) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  `estado` TINYINT NOT NULL DEFAULT 1,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) 
    REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 3. TABLA: estados (Estados operativos de servidores)
-- ===================================================
CREATE TABLE `estados` (
  `id_estado` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 4. TABLA: tipos_servidor
-- ===================================================
CREATE TABLE `tipos_servidor` (
  `id_tipo` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 5. TABLA: ubicaciones
-- ===================================================
CREATE TABLE `ubicaciones` (
  `id_ubicacion` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 6. TABLA: servidores
-- ===================================================
CREATE TABLE `servidores` (
  `id_servidor` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `hostname` VARCHAR(100) NULL,
  `ip` VARCHAR(50) NOT NULL,
  `mac` VARCHAR(50) NULL,
  `serial` VARCHAR(100) NULL,
  `sistema_operativo` VARCHAR(100) NULL,
  `version_so` VARCHAR(50) NULL,
  `fabricante` VARCHAR(100) NULL,
  `modelo` VARCHAR(100) NULL,
  `descripcion` TEXT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_tipo` INT NULL DEFAULT 1,
  `id_estado` INT NOT NULL DEFAULT 1,
  `id_ubicacion` INT NULL DEFAULT 1,
  CONSTRAINT `fk_servidores_estado` FOREIGN KEY (`id_estado`) 
    REFERENCES `estados` (`id_estado`) ON UPDATE CASCADE,
  CONSTRAINT `fk_servidores_tipo` FOREIGN KEY (`id_tipo`) 
    REFERENCES `tipos_servidor` (`id_tipo`) ON UPDATE CASCADE,
  CONSTRAINT `fk_servidores_ubicacion` FOREIGN KEY (`id_ubicacion`) 
    REFERENCES `ubicaciones` (`id_ubicacion`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 7. TABLA: solicitudes_acceso
-- ===================================================
CREATE TABLE `solicitudes_acceso` (
  `id_solicitud` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `correo` VARCHAR(150) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `justificacion` TEXT NOT NULL,
  `id_rol` INT NOT NULL,
  `estado` VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  `fecha_solicitud` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_solicitudes_roles` FOREIGN KEY (`id_rol`) 
    REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- 8. TABLAS DE MONITOREO Y ALERTAS
-- ===================================================
CREATE TABLE `tipos_alerta` (
  `id_tipo_alerta` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `severidades` (
  `id_severidad` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `estados_alerta` (
  `id_estado_alerta` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `alertas` (
  `id_alerta` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NULL,
  `fecha_generada` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_resuelta` DATETIME NULL,
  `id_servidor` INT NULL,
  `id_tipo_alerta` INT NULL,
  `id_severidad` INT NOT NULL,
  `id_estado_alerta` INT NOT NULL DEFAULT 1,
  CONSTRAINT `fk_alertas_servidor` FOREIGN KEY (`id_servidor`) 
    REFERENCES `servidores` (`id_servidor`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_alertas_tipo` FOREIGN KEY (`id_tipo_alerta`) 
    REFERENCES `tipos_alerta` (`id_tipo_alerta`) ON UPDATE CASCADE,
  CONSTRAINT `fk_alertas_severidad` FOREIGN KEY (`id_severidad`) 
    REFERENCES `severidades` (`id_severidad`) ON UPDATE CASCADE,
  CONSTRAINT `fk_alertas_estado` FOREIGN KEY (`id_estado_alerta`) 
    REFERENCES `estados_alerta` (`id_estado_alerta`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- INSERCIÓN DE DATOS INICIALES (SEED DATA)
-- ===================================================

-- 1. Roles del Sistema
INSERT INTO `roles` (`id_rol`, `nombre`, `nombre_rol`, `descripcion`, `estado`) VALUES
(1, 'Administrador', 'Administrador', 'Acceso completo al sistema y configuración.', 1),
(2, 'Técnico', 'Técnico', 'Administración básica de servidores y monitoreo.', 1),
(3, 'Auditor', 'Auditor', 'Acceso de solo lectura a reportes y auditorías.', 1),
(4, 'Usuario', 'Usuario', 'Acceso limitado a información asignada.', 1);

-- 2. Estados de Servidores
INSERT INTO `estados` (`id_estado`, `nombre`) VALUES
(1, 'Activo'),
(2, 'En mantenimiento'),
(3, 'Caído'),
(4, 'Inactivo');

-- 3. Tipos de Servidor
INSERT INTO `tipos_servidor` (`id_tipo`, `nombre`) VALUES
(1, 'Aplicaciones'),
(2, 'Base de datos'),
(3, 'Web'),
(4, 'Archivos');

-- 4. Ubicaciones
INSERT INTO `ubicaciones` (`id_ubicacion`, `nombre`) VALUES
(1, 'Bogotá'),
(2, 'Medellín'),
(3, 'Cali'),
(4, 'Barranquilla'),
(5, 'Datacenter Principal');

-- 5. Catálogos de Alertas
INSERT INTO `tipos_alerta` (`id_tipo_alerta`, `nombre`) VALUES
(1, 'Hardware'),
(2, 'Rendimiento'),
(3, 'Red'),
(4, 'Seguridad'),
(5, 'Sistema');

INSERT INTO `severidades` (`id_severidad`, `nombre`) VALUES
(1, 'Crítica'),
(2, 'Advertencia'),
(3, 'Informativa');

INSERT INTO `estados_alerta` (`id_estado_alerta`, `nombre`) VALUES
(1, 'Nuevo'),
(2, 'En progreso'),
(3, 'Leída');

-- 6. Usuarios Iniciales (Password: admin123 con hash bcrypt)
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `telefono`, `password_hash`, `id_rol`, `estado`, `fecha_creacion`) VALUES
(1, 'Administrador', 'InfraCore', 'admin@infracore.com', '3001234567', '$2b$10$soS45lgaKefhP0LKFlJqY.sGqN7k9.BRS4QVSsN7OwhEeARe7FzWO', 1, 1, NOW()),
(2, 'Carlos', 'Gómez', 'tecnico@infracore.com', '3109876543', '$2b$10$soS45lgaKefhP0LKFlJqY.sGqN7k9.BRS4QVSsN7OwhEeARe7FzWO', 2, 1, NOW()),
(3, 'Laura', 'Martínez', 'auditor@infracore.com', '3205551234', '$2b$10$soS45lgaKefhP0LKFlJqY.sGqN7k9.BRS4QVSsN7OwhEeARe7FzWO', 3, 1, NOW()),
(4, 'Andrés', 'Pérez', 'usuario@infracore.com', '3154449876', '$2b$10$soS45lgaKefhP0LKFlJqY.sGqN7k9.BRS4QVSsN7OwhEeARe7FzWO', 4, 1, NOW());

-- 7. Servidores Iniciales
INSERT INTO `servidores` (`id_servidor`, `nombre`, `hostname`, `ip`, `mac`, `serial`, `sistema_operativo`, `version_so`, `fabricante`, `modelo`, `descripcion`, `fecha_registro`, `id_tipo`, `id_estado`, `id_ubicacion`) VALUES
(1, 'SRV-PROD-APP01', 'srv-prod-app01.infracore.local', '192.168.1.10', '00:1A:2B:3C:4D:01', 'SN-2024-001', 'Ubuntu Server', '22.04 LTS', 'Dell', 'PowerEdge R740', 'Servidor principal de aplicaciones productivas', NOW() - INTERVAL 15 DAY, 1, 1, 5),
(2, 'SRV-PROD-DB01', 'srv-prod-db01.infracore.local', '192.168.1.11', '00:1A:2B:3C:4D:02', 'SN-2024-002', 'Red Hat Enterprise Linux', '9.2', 'HPE', 'ProLiant DL380 Gen10', 'Clúster principal de Base de Datos MySQL/Oracle', NOW() - INTERVAL 12 DAY, 2, 1, 5),
(3, 'SRV-WEB-NGINX01', 'srv-web01.infracore.local', '192.168.1.12', '00:1A:2B:3C:4D:03', 'SN-2024-003', 'Debian GNU/Linux', '12 Bookworm', 'Dell', 'PowerEdge R640', 'Servidor Web Nginx reverse proxy', NOW() - INTERVAL 8 DAY, 3, 2, 1),
(4, 'SRV-STORAGE-NAS', 'srv-nas01.infracore.local', '192.168.1.13', '00:1A:2B:3C:4D:04', 'SN-2024-004', 'TrueNAS SCALE', '23.10', 'Synology', 'RackStation RS3618xs', 'Almacenamiento de backups y archivos compartidos', NOW() - INTERVAL 5 DAY, 4, 1, 2),
(5, 'SRV-DEV-TEST01', 'srv-dev01.infracore.local', '192.168.1.14', '00:1A:2B:3C:4D:05', 'SN-2024-005', 'CentOS Stream', '9', 'Lenovo', 'ThinkSystem SR650', 'Entorno de pruebas y control de calidad', NOW() - INTERVAL 2 DAY, 1, 3, 3);

-- 8. Solicitudes de Acceso de Prueba
INSERT INTO `solicitudes_acceso` (`id_solicitud`, `nombre_completo`, `correo`, `area`, `justificacion`, `id_rol`, `estado`, `fecha_solicitud`) VALUES
(1, 'Mariana Morales', 'mmorales@empresa.com', 'Seguridad de la Información', 'Revisión y auditoría trimestral de registros y servidores de red', 3, 'Pendiente', NOW() - INTERVAL 2 HOUR),
(2, 'Juan David Ríos', 'jrios@empresa.com', 'Infraestructura y Redes', 'Mantenimiento preventivo de servidores Linux y bases de datos', 2, 'Pendiente', NOW() - INTERVAL 5 HOUR),
(3, 'Elena Castillo', 'ecastillo@empresa.com', 'Desarrollo de Software', 'Despliegue del nuevo módulo de facturación electrónica', 4, 'Aprobada', NOW() - INTERVAL 1 DAY),
(4, 'Fernando Castro', 'fcastro@empresa.com', 'Comercial y Ventas', 'Acceso para consultar estado de servidores', 4, 'Rechazada', NOW() - INTERVAL 2 DAY);

-- 9. Alertas Iniciales
INSERT INTO `alertas` (`id_alerta`, `titulo`, `descripcion`, `fecha_generada`, `fecha_resuelta`, `id_servidor`, `id_tipo_alerta`, `id_severidad`, `id_estado_alerta`) VALUES
(1, 'Uso de CPU elevado', 'El uso de CPU superó el umbral del 92% durante más de 10 minutos', NOW() - INTERVAL 35 MINUTE, NULL, 5, 2, 1, 1),
(2, 'Capacidad de disco al 88%', 'El volumen /var/log en SRV-PROD-APP01 está próximo a llenarse', NOW() - INTERVAL 2 HOUR, NULL, 1, 2, 2, 1),
(3, 'Mantenimiento programado', 'Reinicio rutinario programado para aplicación de parches de seguridad', NOW() - INTERVAL 4 HOUR, NULL, 3, 5, 3, 2),
(4, 'Conexión de red restablecida', 'La interfaz eth0 de SRV-STORAGE-NAS recuperó enlace a 10Gbps', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 23 HOUR, 4, 3, 3, 3);

-- ===================================================
-- 10. TABLAS DE AUDITORÍA Y PARÁMETROS
-- ===================================================
CREATE TABLE IF NOT EXISTS `historial_cambios` (
  `id_historial` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario` VARCHAR(100) NOT NULL,
  `modulo` VARCHAR(100) NOT NULL,
  `accion` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `ip` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `logs_sistema` (
  `id_log` INT AUTO_INCREMENT PRIMARY KEY,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `level` VARCHAR(20) NOT NULL,
  `service` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `metadata` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `parametros_sistema` (
  `id_parametro` INT AUTO_INCREMENT PRIMARY KEY,
  `clave` VARCHAR(100) NOT NULL UNIQUE,
  `valor` TEXT NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `fecha_actualizacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Semillas de Auditoría y Parámetros
INSERT IGNORE INTO `historial_cambios` (`id_historial`, `fecha`, `usuario`, `modulo`, `accion`, `descripcion`, `ip`) VALUES
(1, NOW() - INTERVAL 2 HOUR, 'admin@infracore.com', 'Servidores', 'Actualización', 'Se actualizó el estado del servidor SRV-WEB-NGINX01 a En mantenimiento', '192.168.1.100'),
(2, NOW() - INTERVAL 4 HOUR, 'admin@infracore.com', 'Usuarios', 'Creación', 'Se creó el usuario tecnico@infracore.com con rol Técnico', '192.168.1.100'),
(3, NOW() - INTERVAL 6 HOUR, 'tecnico@infracore.com', 'Servidores', 'Registro', 'Se registró el servidor SRV-STORAGE-NAS en ubicación Medellín', '192.168.1.105'),
(4, NOW() - INTERVAL 8 HOUR, 'admin@infracore.com', 'Solicitudes', 'Aprobación', 'Se aprobó la solicitud de acceso para Carlos Gómez', '192.168.1.100'),
(5, NOW() - INTERVAL 12 HOUR, 'sistema', 'Alertas', 'Generación', 'Alerta crítica generada: Uso de CPU elevado en SRV-DEV-TEST01', '127.0.0.1'),
(6, NOW() - INTERVAL 1 DAY, 'sistema', 'Backups', 'Ejecución', 'Backup diario de base de datos MySQL ejecutado exitosamente', '127.0.0.1');

INSERT IGNORE INTO `logs_sistema` (`id_log`, `timestamp`, `level`, `service`, `message`, `metadata`) VALUES
(1, NOW() - INTERVAL 5 MINUTE, 'INFO', 'Auth', 'Inicio de sesión exitoso para usuario admin@infracore.com', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0"}'),
(2, NOW() - INTERVAL 15 MINUTE, 'WARN', 'Servidores', 'Latencia elevada detectada en enlace con Datacenter Principal (>85ms)', '{"host":"192.168.1.10","latencyMs":89}'),
(3, NOW() - INTERVAL 35 MINUTE, 'ERROR', 'Sistema', 'Fallo temporal en resolución de nombres DNS secundario 192.168.1.254', '{"dns":"192.168.1.254","code":"ETIMEDOUT"}'),
(4, NOW() - INTERVAL 1 HOUR, 'INFO', 'API Gateway', 'Petición GET /api/servidores completada en 12ms', '{"status":200,"size":1420}'),
(5, NOW() - INTERVAL 2 HOUR, 'DEBUG', 'Base de datos', 'Pool de conexiones MySQL: 2 activas, 8 inactivas', '{"active":2,"idle":8}'),
(6, NOW() - INTERVAL 3 HOUR, 'WARN', 'Alertas', 'Umbral de memoria advertencia alcanzado en SRV-PROD-APP01 (88%)', '{"srv":"SRV-PROD-APP01","memPct":88}');

INSERT IGNORE INTO `parametros_sistema` (`id_parametro`, `clave`, `valor`, `categoria`, `descripcion`) VALUES
(1, 'app_name', 'InfraCore Enterprise', 'General', 'Nombre visible de la plataforma corporativa'),
(2, 'alert_cpu_threshold', '90', 'Monitoreo', 'Umbral de alerta crítica de CPU en porcentaje'),
(3, 'alert_ram_threshold', '85', 'Monitoreo', 'Umbral de alerta crítica de memoria RAM en porcentaje'),
(4, 'smtp_host', 'smtp.infracore.local', 'Notificaciones', 'Servidor SMTP para notificaciones por correo'),
(5, 'smtp_port', '587', 'Notificaciones', 'Puerto del servidor SMTP'),
(6, 'session_timeout_hours', '8', 'Seguridad', 'Tiempo de expiración de sesiones JWT en horas'),
(7, 'maintenance_mode', 'false', 'Mantenimiento', 'Activar modo de mantenimiento en la plataforma');
