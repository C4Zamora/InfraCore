import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import "../../../Styles/RequestAccess.css";

const RequestAccess = () => {

  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    area: "",
    justification: "",
    rol: "",
  });

  const [loading, setLoading] = useState(false);

  // CARGAR ROLES
  useEffect(() => {

    fetchRoles();

  }, []);

  const fetchRoles = async () => {

    try {

      const response = await axios.get(
        "http://localhost:3001/api/solicitudes/roles"
      );

      setRoles(response.data);

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los roles",
      });

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.area ||
      !formData.justification ||
      !formData.rol
    ) {

      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos.",
        confirmButtonColor: "#1d6fe9",
      });

      return;

    }

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:3001/api/solicitudes/crear",
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "La solicitud fue enviada correctamente.",
        confirmButtonColor: "#1d6fe9",
      });

      // LIMPIAR FORMULARIO
      setFormData({
        fullName: "",
        email: "",
        area: "",
        justification: "",
        rol: "",
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al enviar la solicitud.",
        confirmButtonColor: "#ef4444",
      });

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="request-container">

      <div className="request-card">

        <div className="request-logo">

          <h2>
            <span className="infra">Infra</span>
            <span className="core">Core</span>
          </h2>

          <p>Solicitud de acceso al sistema</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="request-group">

            <label>Nombre completo</label>

            <input
              type="text"
              name="fullName"
              placeholder="Ingrese su nombre"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

          <div className="request-group">

            <label>Correo corporativo</label>

            <input
              type="email"
              name="email"
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="request-group">

            <label>Área / Cargo</label>

            <input
              type="text"
              name="area"
              placeholder="Ej: Infraestructura"
              value={formData.area}
              onChange={handleChange}
            />

          </div>

          <div className="request-group">

            <label>Rol solicitado</label>
            <select
  name="rol"
  value={formData.rol}
  onChange={handleChange}
>

              <option value="">
                Seleccione un rol
              </option>

              {roles.map((rol) => (

                <option
                  key={rol.id_rol}
                  value={rol.id_rol}
                >
                  {rol.nombre}
                </option>

              ))}

            </select>

          </div>

          <div className="request-group">

            <label>Justificación</label>

            <textarea
              name="justification"
              placeholder="Explique por qué necesita acceso"
              value={formData.justification}
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="request-btn"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>

          <Link
            to="/login"
            className="back-login"
          >
            Volver al login
          </Link>

        </form>

      </div>

    </div>

  );

};

export default RequestAccess;