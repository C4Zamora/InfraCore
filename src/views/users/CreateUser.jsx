// CreateUser.jsx

import React, { useState } from 'react'

import axios from 'axios'

import '../../Styles/createUser.css'

import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'

import Swal from 'sweetalert2'

import CIcon from '@coreui/icons-react'

import {
  cilArrowLeft,
  cilSave,
} from '@coreui/icons'

const API_URL =
  'http://localhost:3001/api/usuarios'

const CreateUser = () => {

  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      id_rol: '',
   
    })

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // =========================
  // CREAR USUARIO
  // =========================

  const handleSubmit = async () => {

    // VALIDACIONES

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.correo ||
      !formData.password ||
      !formData.id_rol
    ) {

      Swal.fire({
        icon: 'warning',
        title:
          'Campos requeridos',
        text:
          'Complete todos los campos obligatorios.',
      })

      return
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      Swal.fire({
        icon: 'error',
        title:
          'Contraseñas diferentes',
        text:
          'Las contraseñas no coinciden.',
      })

      return
    }

    try {

      setLoading(true)

      // =========================
      // REQUEST BACKEND
      // =========================

      const response =
  await axios.post(
    API_URL,
    {
      nombre:
        formData.nombre,

      apellido:
        formData.apellido,

      correo:
        formData.correo,

      telefono:
        formData.telefono,

      password:
        formData.password,

      id_rol:
        formData.id_rol,

     
    }
  )

      console.log(response.data)

      Swal.fire({
        icon: 'success',
        title:
          'Usuario creado',
        text:
          'El usuario fue registrado correctamente.',
      })

      // =========================
      // LIMPIAR FORMULARIO
      // =========================

      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        id_rol: '',

      })

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data
            ?.message ||
          'Ocurrió un error al crear el usuario.',
      })

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="create-user-container">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="create-user-header">

        <div>

          <h2 className="create-user-title">
            Crear usuario
          </h2>

          <p className="create-user-subtitle">
            Complete la información
            para registrar un nuevo
            usuario.
          </p>

        </div>

        <CButton
          color="light"
          className="back-button"
          onClick={() =>
            navigate('/usuarios')
          }
        >

          <CIcon
            icon={cilArrowLeft}
            className="me-2"
          />

          Volver

        </CButton>

      </div>

      {/* ========================= */}
      {/* CARD */}
      {/* ========================= */}

      <CCard className="create-user-card">

        <CCardHeader className="create-user-card-header">

          Información del usuario

        </CCardHeader>

        <CCardBody>

          <CRow className="g-4">

            {/* NOMBRE */}

            <CCol md={6}>

              <CFormLabel>
                Nombre *
              </CFormLabel>

              <CFormInput
                name="nombre"
                value={
                  formData.nombre
                }
                onChange={
                  handleChange
                }
                placeholder="Ingrese el nombre"
              />

            </CCol>

            {/* APELLIDO */}

            <CCol md={6}>

              <CFormLabel>
                Apellido *
              </CFormLabel>

              <CFormInput
                name="apellido"
                value={
                  formData.apellido
                }
                onChange={
                  handleChange
                }
                placeholder="Ingrese el apellido"
              />

            </CCol>

            {/* CORREO */}

            <CCol md={6}>

              <CFormLabel>
                Correo electrónico *
              </CFormLabel>

              <CFormInput
                type="email"
                name="correo"
                value={
                  formData.correo
                }
                onChange={
                  handleChange
                }
                placeholder="correo@empresa.com"
              />

            </CCol>

            {/* TELEFONO */}

            <CCol md={6}>

              <CFormLabel>
                Teléfono
              </CFormLabel>

              <CFormInput
                name="telefono"
                value={
                  formData.telefono
                }
                onChange={
                  handleChange
                }
                placeholder="3001234567"
              />

            </CCol>

            {/* ROL */}

            <CCol md={6}>

              <CFormLabel>
                Rol *
              </CFormLabel>

              <CFormSelect
                name="id_rol"
                value={
                  formData.id_rol
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Seleccione un rol
                </option>

                <option value="1">
                  Administrador
                </option>

                <option value="2">
                  Analista
                </option>

                <option value="3">
                  Auditor
                </option>

              </CFormSelect>

            </CCol>

            {/* ESTADO */}

           

            {/* PASSWORD */}

            <CCol md={6}>

              <CFormLabel>
                Contraseña *
              </CFormLabel>

              <CFormInput
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Ingrese la contraseña"
              />

            </CCol>

            {/* CONFIRM PASSWORD */}

            <CCol md={6}>

              <CFormLabel>
                Confirmar contraseña *
              </CFormLabel>

              <CFormInput
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Confirme la contraseña"
              />

            </CCol>

          </CRow>

          {/* BOTONES */}

          <div className="create-user-actions">

            <CButton
              color="light"
              className="cancel-button"
              onClick={() =>
                navigate('/usuarios')
              }
            >
              Cancelar
            </CButton>

            <CButton
              className="save-button"
              onClick={handleSubmit}
              disabled={loading}
            >

              <CIcon
                icon={cilSave}
                className="me-2"
              />

              {loading
                ? 'Guardando...'
                : 'Crear usuario'}

            </CButton>

          </div>

        </CCardBody>

      </CCard>

    </div>
  )
}

export default CreateUser