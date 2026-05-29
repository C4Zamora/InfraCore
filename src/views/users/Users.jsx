import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import axios from 'axios'

import '../../Styles/user.css'

import { useNavigate } from 'react-router-dom'

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users as UsersIcon,
} from 'lucide-react'

import Swal from 'sweetalert2'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const API_URL =
  'http://localhost:3001/api/usuarios'

const getStatusColor = (estado) => {
  switch (estado) {

    case 'Activo':
      return 'success'

    case 'Inactivo':
      return 'danger'

    default:
      return 'secondary'
  }
}

const getRoleColor = (rol) => {
  switch (rol) {

    case 'Administrador':
      return 'primary'

    case 'Tecnico':
      return 'info'

    case 'Auditor':
      return 'dark'

    default:
      return 'secondary'
  }
}

const Users = () => {

  const navigate = useNavigate()

  const [usuarios, setUsuarios] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [rolFilter, setRolFilter] =
    useState('')

  const [estadoFilter, setEstadoFilter] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  // =========================
  // MODALES
  // =========================

  const [viewModal, setViewModal] =
    useState(false)

  const [editModal, setEditModal] =
    useState(false)

  const [selectedUser, setSelectedUser] =
    useState(null)

  const [editData, setEditData] =
    useState({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      id_rol: '',
      estado: '',
    })

  // =========================
  // OBTENER USUARIOS
  // =========================

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const obtenerUsuarios = async () => {

    try {

      setLoading(true)

      const response =
        await axios.get(API_URL)

      setUsuarios(response.data)

    } catch (error) {

      console.error(
        'Error obteniendo usuarios:',
        error
      )

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'No fue posible cargar los usuarios.',
      })

    } finally {

      setLoading(false)
    }
  }

  // =========================
  // FILTROS
  // =========================

  const filteredUsers = useMemo(() => {

    return usuarios.filter((user) => {

      const nombreCompleto =
        `${user.nombre} ${user.apellido}`

      const matchSearch =
        nombreCompleto
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.correo
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchRol = rolFilter
        ? user.rol === rolFilter
        : true

      const matchEstado =
        estadoFilter
          ? user.estado_texto ===
            estadoFilter
          : true

      return (
        matchSearch &&
        matchRol &&
        matchEstado
      )
    })

  }, [
    usuarios,
    search,
    rolFilter,
    estadoFilter,
  ])

  // =========================
  // VER USUARIO
  // =========================

  const handleView = (user) => {

    setSelectedUser(user)

    setViewModal(true)
  }

  // =========================
  // EDITAR USUARIO
  // =========================

  const handleEdit = (user) => {

    setSelectedUser(user)

    setEditData({
      nombre: user.nombre || '',
      apellido:
        user.apellido || '',
      correo:
        user.correo || '',
      telefono:
        user.telefono || '',
      id_rol:
        user.id_rol || '',
      estado:
        user.estado ?? 1,
    })

    setEditModal(true)
  }

  const handleEditChange = (e) => {

    setEditData({
      ...editData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleUpdateUser =
    async () => {

      if (
        !editData.nombre ||
        !editData.apellido ||
        !editData.correo
      ) {

        Swal.fire({
          icon: 'warning',
          title:
            'Campos requeridos',
          text:
            'Completa toda la información.',
        })

        return
      }

      try {

        await axios.put(
          `${API_URL}/${selectedUser.id_usuario}`,
          editData
        )

        Swal.fire({
          icon: 'success',
          title:
            'Usuario actualizado',
          text:
            'Los cambios fueron guardados correctamente.',
        })

        setEditModal(false)

        obtenerUsuarios()

      } catch (error) {

        console.error(
          'Error actualizando usuario:',
          error
        )

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            'No fue posible actualizar el usuario.',
        })
      }
    }

  // =========================
  // ELIMINAR USUARIO
  // =========================

  const handleDelete =
    async (user) => {

      const result =
        await Swal.fire({
          icon: 'warning',
          title:
            '¿Eliminar usuario?',
          text:
            'Esta acción no se puede deshacer.',
          showCancelButton: true,
          confirmButtonText:
            'Sí, eliminar',
          cancelButtonText:
            'Cancelar',
          confirmButtonColor:
            '#d33',
        })

      if (!result.isConfirmed)
        return

      try {

        await axios.delete(
          `${API_URL}/${user.id_usuario}`
        )

        Swal.fire({
          icon: 'success',
          title:
            'Usuario eliminado',
          text:
            'El usuario fue eliminado correctamente.',
        })

        obtenerUsuarios()

      } catch (error) {

        console.error(
          'Error eliminando usuario:',
          error
        )

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            'No fue posible eliminar el usuario.',
        })
      }
    }

  return (
    <>

      <div className="mb-4 d-flex justify-content-between align-items-center">

        <div>

          <div className="d-flex align-items-center gap-2">

            <UsersIcon size={24} />

            <h3 className="fw-bold mb-0">
              Usuarios
            </h3>

          </div>

          <p className="text-medium-emphasis mb-0">
            Administración de usuarios del sistema
          </p>

        </div>

        <CButton
          color="primary"
          className="d-flex align-items-center gap-2"
          onClick={() =>
            navigate('/crear-usuario')
          }
        >

          <Plus size={18} />

          Crear usuario

        </CButton>

      </div>

      <CCard className="shadow-sm border-0">

        <CCardBody>

          <CRow className="mb-4 g-3">

            <CCol md={4}>

              <CInputGroup>

                <CInputGroupText>
                  <Search size={16} />
                </CInputGroupText>

                <CFormInput
                  placeholder="Buscar usuario..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </CInputGroup>

            </CCol>

            <CCol md={2}>

              <CFormSelect
                value={rolFilter}
                onChange={(e) =>
                  setRolFilter(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Rol: Todos
                </option>

                <option>
                  Administrador
                </option>

                <option>
                  Tecnico
                </option>

                <option>
                  Auditor
                </option>

              </CFormSelect>

            </CCol>

            <CCol md={2}>

              <CFormSelect
                value={estadoFilter}
                onChange={(e) =>
                  setEstadoFilter(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Estado: Todos
                </option>

                <option>
                  Activo
                </option>

                <option>
                  Inactivo
                </option>

              </CFormSelect>

            </CCol>

          </CRow>

          <CTable
            hover
            responsive
            align="middle"
          >

            <CTableHead>

              <CTableRow>

                <CTableHeaderCell>
                  ID
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Nombre completo
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Correo electrónico
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Rol
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Estado
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Fecha creación
                </CTableHeaderCell>

                <CTableHeaderCell className="text-center">
                  Acciones
                </CTableHeaderCell>

              </CTableRow>

            </CTableHead>

            <CTableBody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map(
                  (user) => (

                    <CTableRow
                      key={
                        user.id_usuario
                      }
                    >

                      <CTableDataCell>
                        #{user.id_usuario}
                      </CTableDataCell>

                      <CTableDataCell>
                        {user.nombre}{' '}
                        {user.apellido}
                      </CTableDataCell>

                      <CTableDataCell>
                        {user.correo}
                      </CTableDataCell>

                      <CTableDataCell>

                        <CBadge
                          color={getRoleColor(
                            user.rol
                          )}
                        >
                          {user.rol}
                        </CBadge>

                      </CTableDataCell>

                      <CTableDataCell>

                        <CBadge
                          color={getStatusColor(
                            user.estado_texto
                          )}
                        >
                          {
                            user.estado_texto
                          }
                        </CBadge>

                      </CTableDataCell>

                      <CTableDataCell>

                        {user.fecha_creacion
                          ? new Date(
                              user.fecha_creacion
                            ).toLocaleString(
                              'es-CO'
                            )
                          : 'Sin fecha'}

                      </CTableDataCell>

                      <CTableDataCell>

                        <div className="d-flex justify-content-center gap-2">

                          <CButton
                            color="light"
                            size="sm"
                            onClick={() =>
                              handleView(
                                user
                              )
                            }
                          >
                            <Eye size={16} />
                          </CButton>

                          <CButton
                            color="light"
                            size="sm"
                            onClick={() =>
                              handleEdit(
                                user
                              )
                            }
                          >
                            <Pencil size={16} />
                          </CButton>

                          <CButton
                            color="light"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </CButton>

                        </div>

                      </CTableDataCell>

                    </CTableRow>

                  )
                )

              ) : (

                <CTableRow>

                  <CTableDataCell
                    colSpan={7}
                    className="text-center py-4"
                  >

                    {loading
                      ? 'Cargando usuarios...'
                      : 'No hay usuarios registrados'}

                  </CTableDataCell>

                </CTableRow>

              )}

            </CTableBody>

          </CTable>

        </CCardBody>

      </CCard>

      {/* ========================= */}
      {/* MODAL VER */}
      {/* ========================= */}

      <CModal
        visible={viewModal}
        onClose={() =>
          setViewModal(false)
        }
      >

        <CModalHeader>

          <CModalTitle>
            Detalle usuario
          </CModalTitle>

        </CModalHeader>

        <CModalBody>

          {selectedUser && (

            <div className="d-flex flex-column gap-3">

              <div>
                <strong>
                  Nombre:
                </strong>{' '}
                {selectedUser.nombre}{' '}
                {selectedUser.apellido}
              </div>

              <div>
                <strong>
                  Correo:
                </strong>{' '}
                {selectedUser.correo}
              </div>

              <div>
                <strong>
                  Teléfono:
                </strong>{' '}
                {selectedUser.telefono}
              </div>

              <div>
                <strong>
                  Rol:
                </strong>{' '}
                {selectedUser.rol}
              </div>

              <div>
                <strong>
                  Estado:
                </strong>{' '}
                {
                  selectedUser.estado_texto
                }
              </div>

            </div>

          )}

        </CModalBody>

      </CModal>

      {/* ========================= */}
      {/* MODAL EDITAR */}
      {/* ========================= */}

      <CModal
        visible={editModal}
        onClose={() =>
          setEditModal(false)
        }
      >

        <CModalHeader>

          <CModalTitle>
            Editar usuario
          </CModalTitle>

        </CModalHeader>

        <CModalBody>

          <div className="d-flex flex-column gap-3">

            <div>

              <label>
                Nombre
              </label>

              <CFormInput
                name="nombre"
                value={
                  editData.nombre
                }
                onChange={
                  handleEditChange
                }
              />

            </div>

            <div>

              <label>
                Apellido
              </label>

              <CFormInput
                name="apellido"
                value={
                  editData.apellido
                }
                onChange={
                  handleEditChange
                }
              />

            </div>

            <div>

              <label>
                Correo
              </label>

              <CFormInput
                name="correo"
                value={
                  editData.correo
                }
                onChange={
                  handleEditChange
                }
              />

            </div>

            <div>

              <label>
                Teléfono
              </label>

              <CFormInput
                name="telefono"
                value={
                  editData.telefono
                }
                onChange={
                  handleEditChange
                }
              />

            </div>

            <div>

              <label>
                Rol
              </label>

              <CFormSelect
                name="id_rol"
                value={editData.id_rol}
                onChange={
                  handleEditChange
                }
              >

                <option value="1">
                  Administrador
                </option>

                <option value="2">
                  Tecnico
                </option>

                <option value="3">
                  Auditor
                </option>

              </CFormSelect>

            </div>

            <div>

              <label>
                Estado
              </label>

              <CFormSelect
                name="estado"
                value={
                  editData.estado
                }
                onChange={
                  handleEditChange
                }
              >

                <option value="1">
                  Activo
                </option>

                <option value="0">
                  Inactivo
                </option>

              </CFormSelect>

            </div>

          </div>

        </CModalBody>

        <CModalFooter>

          <CButton
            color="secondary"
            onClick={() =>
              setEditModal(false)
            }
          >
            Cancelar
          </CButton>

          <CButton
            color="primary"
            onClick={
              handleUpdateUser
            }
          >
            Guardar cambios
          </CButton>

        </CModalFooter>

      </CModal>

    </>
  )
}

export default Users