const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true })
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'infracore'
})

connection.connect((err) => {
  if (err) {
    console.log('Error conexión DB:', err.message)
  } else {
    console.log(`MySQL conectado exitosamente a "${process.env.DB_NAME || 'infracore'}"`)
  }
})

module.exports = connection