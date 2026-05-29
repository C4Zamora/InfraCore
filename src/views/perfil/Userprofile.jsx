import React, { useEffect, useState } from 'react'

import axios from 'axios'

import Swal from 'sweetalert2'

import '../../Styles/userProfile.css'

const Userprofile = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_rol: '',
    rol: '',
  })

  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  })

  const [roles, setRoles] = useState([])

  // USUARIO EN SESION
  const userId = localStorage.getItem('id_usuario')

  useEffect(() => {

    obtenerRoles()

    // TEMPORAL:
    // si no existe login aún,
    // carga usuario 1

    if (userId) {

      obtenerPerfil(userId)

    } else {

      obtenerPerfil(1)
    }

  }, [])

  // OBTENER PERFIL
  const obtenerPerfil = async (id) => {

    try {

      const response = await axios.get(
        `http://localhost:3001/api/profile/${id}`
      )

      setFormData(response.data)

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el perfil',
      })
    }
  }

  // OBTENER ROLES
  const obtenerRoles = async () => {

  try {

    const response = await axios.get(
      'http://localhost:3001/api/roles'
    )

    setRoles(response.data)

  } catch (error) {

    // SOLO LOG, NO ALERTA
    console.error('Error cargando roles:', error)

  }
}

  // HANDLE INPUTS
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // HANDLE PASSWORD
  const handlePasswordChange = (e) => {

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  // GUARDAR PERFIL
  const guardarPerfil = async () => {

    try {

      await axios.put(
        `http://localhost:3001/api/profile/${userId || 1}`,
        formData
      )

      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
      })

      obtenerPerfil(userId || 1)

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil',
      })
    }
  }

  // ACTUALIZAR PASSWORD
  const cambiarPassword = async () => {

    if (!passwordData.nueva || !passwordData.confirmar) {

      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
      })
    }

    if (passwordData.nueva !== passwordData.confirmar) {

      return Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
      })
    }

    try {

      await axios.put(
        `http://localhost:3001/api/profile/password/${userId || 1}`,
        passwordData
      )

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
      })

      setPasswordData({
        actual: '',
        nueva: '',
        confirmar: '',
      })

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña',
      })
    }
  }

  return (

    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">

        <div>

          <h1>
            Configuración de Perfil
          </h1>

          <p>
            Administra tu información personal
          </p>

        </div>

        <button
          className="save-btn"
          onClick={guardarPerfil}
        >
          Guardar cambios
        </button>

      </div>

      {/* CARD */}
      <div className="profile-card">

        {/* PERFIL */}
        <div className="profile-avatar-section">

          <div className="profile-avatar">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
            />

          </div>

          <div className="avatar-info">

            <h3>
              {formData.nombre} {formData.apellido}
            </h3>

            <span>
              {formData.rol}
            </span>

          </div>

        </div>

        {/* FORM */}
        <div className="profile-form">

          <div className="input-group">

            <label>
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Apellido
            </label>

            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Correo
            </label>

            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />

          </div>

        <div className="input-group">

  <label>
    Rol
  </label>

  <input
    type="text"
    value={formData.rol}
    disabled
  />

</div>

        </div>

        {/* SEGURIDAD */}
        <div className="security-section">

          <h2>
            Seguridad
          </h2>

          <div className="security-grid">

            <div className="input-group">

              <label>
                Contraseña actual
              </label>

              <input
                type="password"
                name="actual"
                value={passwordData.actual}
                onChange={handlePasswordChange}
              />

            </div>

            <div className="input-group">

              <label>
                Nueva contraseña
              </label>

              <input
                type="password"
                name="nueva"
                value={passwordData.nueva}
                onChange={handlePasswordChange}
              />

            </div>

            <div className="input-group">

              <label>
                Confirmar contraseña
              </label>

              <input
                type="password"
                name="confirmar"
                value={passwordData.confirmar}
                onChange={handlePasswordChange}
              />

            </div>

          </div>

          <button
            className="save-btn"
            onClick={cambiarPassword}
          >
            Actualizar contraseña
          </button>

        </div>

      </div>

    </div>
  )
}

export default Userprofile