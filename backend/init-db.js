const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

// Cargar .env con override: true para evitar colisión con variables de entorno del sistema
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true })
}

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'fabrica2024*',
  multipleStatements: true
}

async function initDatabase() {
  console.log('===================================================')
  console.log('  InfraCore - Inicialización de Base de Datos')
  console.log('===================================================')
  console.log(`Conectando a MySQL en ${dbConfig.host}:${dbConfig.port} como "${dbConfig.user}"...`)

  let connection
  try {
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Conexión con el servidor MySQL establecida exitosamente.')

    const sqlFilePath = path.join(__dirname, 'database.sql')
    console.log(`Leyendo archivo de esquema: ${sqlFilePath}...`)
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')

    console.log('Ejecutando script de creación de tablas y datos iniciales...')
    await connection.query(sqlContent)

    console.log('✅ Base de datos "infracore" creada y poblada con éxito.')

    // Verificar tablas creadas
    await connection.query('USE `infracore`;')
    const [tables] = await connection.query('SHOW TABLES;')
    console.log('\nTablas verificadas en "infracore":')
    tables.forEach((t) => console.log('  - ' + Object.values(t)[0]))

    // Contar registros principales
    const [[{ usuarios }]] = await connection.query('SELECT COUNT(*) AS usuarios FROM usuarios')
    const [[{ servidores }]] = await connection.query('SELECT COUNT(*) AS servidores FROM servidores')
    const [[{ alertas }]] = await connection.query('SELECT COUNT(*) AS alertas FROM alertas')
    const [[{ solicitudes }]] = await connection.query('SELECT COUNT(*) AS solicitudes FROM solicitudes_acceso')

    console.log('\nResumen de datos iniciales:')
    console.log(`  - Usuarios: ${usuarios}`)
    console.log(`  - Servidores: ${servidores}`)
    console.log(`  - Alertas: ${alertas}`)
    console.log(`  - Solicitudes: ${solicitudes}`)
    console.log('\nCredenciales de acceso inicial:')
    console.log('  - Admin:   admin@infracore.com   / admin123')
    console.log('  - Técnico: tecnico@infracore.com / admin123')
    console.log('  - Auditor: auditor@infracore.com / admin123')
    console.log('===================================================')
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message)
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Verifique el usuario y la contraseña en backend/.env')
    }
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initDatabase()
