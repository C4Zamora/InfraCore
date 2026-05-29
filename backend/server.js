require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const servidoresRoutes = require('./routes/servidores.routes')
const usuariosRoutes = require('./routes/usuarios.routes')
const rolesRoutes = require('./routes/roles.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const alertasRoutes = require('./routes/alertas.routes');
const dashboardRoutes = require('./routes/dashboard.routes')
const profileRoutes = require('./routes/profileRoutes')



const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/servidores', servidoresRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/roles', rolesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/alertas', alertasRoutes);
app.use( '/api/dashboard', dashboardRoutes )
app.use('/api', profileRoutes)


// Puerto del servidor Express
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})