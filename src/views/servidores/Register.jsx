import React, { useState } from 'react'
import axios from 'axios'

import '../../Styles/servidores.css'

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

const Register = () => {

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    serverName: '',
    description: '',
    ip: '',
    serverType: '',
    os: '',
    status: '',
    location: '',
    processor: '',
    ram: '',
    storage: '',
    owner: '',
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateIP = (ip) => {

    const regex =
      /^(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]?\d)){3}$/

    return regex.test(ip)
  }

  const handleSubmit = async () => {

    if (
      !formData.serverName ||
      !formData.ip ||
      !formData.os ||
      !formData.location ||
      !formData.serverType ||
      !formData.status
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete todos los campos obligatorios.',
        confirmButtonColor: '#1d6fe9',
      })

      return
    }

    if (!validateIP(formData.ip)) {

      Swal.fire({
        icon: 'error',
        title: 'IP inválida',
        text: 'Ingrese una dirección IP válida.',
        confirmButtonColor: '#ef4444',
      })

      return
    }

    try {

      setLoading(true)

      await axios.post(
        'http://localhost:3001/api/servidores',
        formData
      )

      Swal.fire({
        icon: 'success',
        title: 'Servidor registrado',
        text: 'El servidor fue registrado correctamente.',
        confirmButtonColor: '#1d6fe9',
      })

      setFormData({
        serverName: '',
        description: '',
        ip: '',
        serverType: '',
        os: '',
        status: '',
        location: '',
        processor: '',
        ram: '',
        storage: '',
        owner: '',
      })

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el servidor.',
        confirmButtonColor: '#ef4444',
      })

    } finally {

      setLoading(false)
    }
  }

  const handleBack = () => {
    console.log('Volver')
  }

  return (

    <div className="register-container">

      <div className="register-header">

        <div>

          <h3 className="register-title">
            Registrar servidor
          </h3>

          <p className="register-subtitle">
            Complete la información para registrar un nuevo servidor en el sistema.
          </p>

        </div>

        <CButton
          color="light"
          className="back-button"
          onClick={handleBack}
        >

          <CIcon
            icon={cilArrowLeft}
            className="me-2"
          />

          Volver a servidores

        </CButton>

      </div>

      <CCard className="register-card">

        <CCardHeader className="register-card-header">
          Información del servidor
        </CCardHeader>

        <CCardBody>

          <CRow className="g-4">

            <CCol md={6}>

              <CFormLabel>
                Nombre del servidor *
              </CFormLabel>

              <CFormInput
                name="serverName"
                value={formData.serverName}
                onChange={handleChange}
                placeholder="Ej: SRV-APP-01"
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Descripción
              </CFormLabel>

              <CFormInput
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción breve del servidor"
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Dirección IP *
              </CFormLabel>

              <CFormInput
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                placeholder="Ej: 192.168.1.10"
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Tipo de servidor *
              </CFormLabel>

              <CFormSelect
                name="serverType"
                value={formData.serverType}
                onChange={handleChange}
              >

                <option value="">
                  Seleccione el tipo
                </option>

                <option value="1">
                  Aplicaciones
                </option>

                <option value="2">
                  Base de datos
                </option>

                <option value="3">
                  Web
                </option>

                <option value="4">
                  Archivos
                </option>

              </CFormSelect>

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Sistema operativo *
              </CFormLabel>

              <CFormInput
                name="os"
                value={formData.os}
                onChange={handleChange}
                placeholder="Ej: Ubuntu 22.04"
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Estado *
              </CFormLabel>

              <CFormSelect
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="">
                  Seleccione un estado
                </option>

                <option value="1">
                  Activo
                </option>

                <option value="2">
                  En mantenimiento
                </option>

                <option value="3">
                  Caído
                </option>

              </CFormSelect>

            </CCol>
<CCol md={6}>

  <CFormLabel>
    Ubicación *
  </CFormLabel>

  <CFormSelect
    name="location"
    value={formData.location}
    onChange={handleChange}
  >

    <option value="">
      Seleccione ubicación
    </option>

    <option value="1">
      Bogotá
    </option>

    <option value="2">
      Medellín
    </option>

    <option value="3">
      Cali
    </option>

    <option value="4">
      Barranquilla
    </option>

    <option value="5">
      Datacenter Principal
    </option>

  </CFormSelect>

</CCol>

          </CRow>

          <div className="section-divider">
            Información adicional
          </div>

          <CRow className="g-4">

            <CCol md={4}>

              <CFormLabel>
                Procesador
              </CFormLabel>

              <CFormInput
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="Ej: Intel Xeon"
              />

            </CCol>

            <CCol md={4}>

              <CFormLabel>
                Memoria RAM
              </CFormLabel>

              <CFormInput
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="Ej: 32 GB"
              />

            </CCol>

            <CCol md={4}>

              <CFormLabel>
                Almacenamiento
              </CFormLabel>

              <CFormInput
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="Ej: 1 TB SSD"
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Responsable
              </CFormLabel>

              <CFormInput
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
              />

            </CCol>

          </CRow>

          <div className="register-actions">

            <CButton
              color="light"
              className="cancel-button"
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
                : 'Guardar servidor'}

            </CButton>

          </div>

        </CCardBody>

      </CCard>

    </div>
  )
}

export default Register