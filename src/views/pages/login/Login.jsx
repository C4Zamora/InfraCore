import React, { useState } from "react"

import "../../../Styles/Login.css"

import { useNavigate } from "react-router-dom"

import axios from "axios"

const Login = () => {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!username || !password) {

      setError("Por favor ingrese usuario y contraseña")

      return
    }

    try {

      setError("")

      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          correo: username,
          password: password,
        }
      )

      console.log(response.data)

      // =========================
      // GUARDAR SESIÓN
      // =========================

      localStorage.setItem(
        "token",
        response.data.token
      )

      localStorage.setItem(
        "id_usuario",
        response.data.usuario.id_usuario
      )

      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.usuario)
      )

      // =========================
      // REDIRECCIÓN
      // =========================

      navigate("/dashboard")

    } catch (error) {

      console.error(error)

      setError("Credenciales incorrectas")
    }
  }

  return (

    <div className="login-container">

      <div className="login-card">

        <div className="logo">

          <h2>
            <span className="infra">Infra</span>
            <span className="core">Core</span>
          </h2>

          <p className="subtitle">
            Acceso seguro al sistema
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Usuario</label>

            <input
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Contraseña</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "icon-eye-off" : "icon-eye"} />
              </button>

            </div>

          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-login">
            Ingresar
          </button>

          <p
            className="access-link"
            onClick={() => navigate("/request-access")}
          >
            Solicitar acceso
          </p>

        </form>

      </div>

    </div>
  )
}

export default Login