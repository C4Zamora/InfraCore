import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilSave, cilSettings, cilLoopCircular } from '@coreui/icons'

const Configuracion = () => {
  const [parametros, setParametros] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingValues, setEditingValues] = useState({})
  const [savingKey, setSavingKey] = useState(null)

  const fetchParametros = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:3001/api/parametros')
      const data = res.data || []
      setParametros(data)

      const initialMap = {}
      data.forEach(p => {
        initialMap[p.clave] = p.valor
      })
      setEditingValues(initialMap)
    } catch (err) {
      console.error('Error cargando parámetros:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los parámetros del sistema.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParametros()
  }, [])

  const handleValueChange = (clave, val) => {
    setEditingValues(prev => ({
      ...prev,
      [clave]: val
    }))
  }

  const handleSave = async (parametro) => {
    const nuevoValor = editingValues[parametro.clave]
    try {
      setSavingKey(parametro.clave)
      await axios.put(`http://localhost:3001/api/parametros/${parametro.id_parametro}`, {
        valor: nuevoValor
      })

      Swal.fire({
        icon: 'success',
        title: 'Parámetro Guardado',
        text: `El parámetro "${parametro.clave}" se actualizó a "${nuevoValor}".`,
        timer: 2000,
        showConfirmButton: false
      })

      fetchParametros()
    } catch (err) {
      console.error('Error guardando parámetro:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || 'Error al guardar el parámetro.'
      })
    } finally {
      setSavingKey(null)
    }
  }

  // Agrupar por categoría
  const categorias = [...new Set(parametros.map(p => p.categoria))]

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <CIcon icon={cilSettings} className="text-primary" />
            Parámetros del Sistema
          </h2>
          <p className="text-muted mb-0">
            Configure las variables operativas, umbrales de alerta y políticas del sistema.
          </p>
        </div>

        <CButton color="primary" variant="outline" onClick={fetchParametros} disabled={loading}>
          <CIcon icon={cilLoopCircular} className={`me-2 ${loading ? 'rotate' : ''}`} />
          {loading ? 'Recargando...' : 'Recargar'}
        </CButton>
      </div>

      {loading && <p className="text-muted">Cargando parámetros...</p>}

      {!loading && categorias.map(cat => {
        const paramsInCat = parametros.filter(p => p.categoria === cat)

        return (
          <CCard key={cat} className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-body-secondary fw-semibold py-3 d-flex justify-content-between align-items-center">
              <span>Categoría: {cat}</span>
              <CBadge color="info">{paramsInCat.length} parámetros</CBadge>
            </CCardHeader>

            <CCardBody className="p-0">
              <CTable responsive align="middle" hover className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '25%' }}>Clave</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '35%' }}>Descripción</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '30%' }}>Valor Configurado</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '10%' }} className="text-center">Acción</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {paramsInCat.map(p => (
                    <CTableRow key={p.id_parametro}>
                      <CTableDataCell>
                        <code className="fw-bold text-primary">{p.clave}</code>
                      </CTableDataCell>

                      <CTableDataCell className="text-muted text-sm">
                        {p.descripcion}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          value={editingValues[p.clave] ?? p.valor}
                          onChange={(e) => handleValueChange(p.clave, e.target.value)}
                        />
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          disabled={savingKey === p.clave || editingValues[p.clave] === p.valor}
                          onClick={() => handleSave(p)}
                          title="Guardar cambio"
                        >
                          <CIcon icon={cilSave} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        )
      })}
    </div>
  )
}

export default Configuracion
