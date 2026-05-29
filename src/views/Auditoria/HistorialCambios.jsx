// HistorialCambios.jsx
// Listo para integración con backend:
// - Reemplaza `fetchHistorial` con tu llamada real a la API (axios / fetch).
// - Los filtros, paginación y orden se envían como query params al backend.
// - Ajusta BASE_URL y los endpoints según tu arquitectura REST.

import { useState, useEffect, useCallback } from 'react';
import '../../Styles/historialCambios.css';

// ─── Constantes ────────────────────────────────────────────────────────────────
const BASE_URL = '/api/v1'; // Cambia por tu URL base real

const MODULOS = ['Todos', 'Servidores', 'Usuarios', 'Roles y permisos', 'Backups', 'Solicitudes', 'Alertas'];
const USUARIOS = ['Todos', 'admin', 'maria.gómez', 'soporte01', 'ana.lopez', 'sistema'];
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ─── Datos de ejemplo (eliminar cuando conectes el backend) ────────────────────
const MOCK_DATA = {
  total: 56,
  registros: [
    { id: 1, fecha: '10/05/2024 09:45:22', usuario: 'admin',       modulo: 'Servidores',       accion: 'Actualización', descripcion: 'Se actualizó el estado del servidor SRV-WEB-03 a Caído',    ip: '192.168.1.100' },
    { id: 2, fecha: '10/05/2024 09:30:15', usuario: 'maria.gomez', modulo: 'Usuarios',         accion: 'Creación',      descripcion: 'Se creó el usuario juan.perez con rol Técnico',             ip: '192.168.1.105' },
    { id: 3, fecha: '10/05/2024 09:15:48', usuario: 'soporte01',   modulo: 'Servidores',       accion: 'Actualización', descripcion: 'Se cambió el servidor SRV-DB-02 a mantenimiento',            ip: '192.168.1.101' },
    { id: 4, fecha: '10/05/2024 08:50:11', usuario: 'admin',       modulo: 'Roles y permisos', accion: 'Actualización', descripcion: 'Se modificaron los permisos del rol Soporte',                ip: '192.168.1.100' },
    { id: 5, fecha: '10/05/2024 08:30:05', usuario: 'sistema',     modulo: 'Backups',          accion: 'Ejecución',     descripcion: 'Backup diario ejecutado correctamente en SRV-DB-02',        ip: '192.168.1.10'  },
    { id: 6, fecha: '10/05/2024 08:15:33', usuario: 'ana.lopez',   modulo: 'Solicitudes',      accion: 'Aprobación',    descripcion: 'Se aprobó la solicitud SOL-2024-026 de Luis García',        ip: '192.168.1.102' },
    { id: 7, fecha: '10/05/2024 07:45:19', usuario: 'sistema',     modulo: 'Alertas',          accion: 'Generación',    descripcion: 'Alerta crítica generada: SRV-WEB-03 caído',                 ip: '192.168.1.10'  },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getBadgeClass(accion) {
  return `badge badge-accion-${accion.toLowerCase()}`;
}

function buildQueryParams(filters, pagination, sort) {
  const params = new URLSearchParams();
  if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
  if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
  if (filters.modulo !== 'Todos') params.append('modulo', filters.modulo);
  if (filters.usuario !== 'Todos') params.append('usuario', filters.usuario);
  if (filters.busqueda) params.append('q', filters.busqueda);
  params.append('page', pagination.page);
  params.append('perPage', pagination.perPage);
  if (sort.field) {
    params.append('sortBy', sort.field);
    params.append('sortDir', sort.dir);
  }
  return params.toString();
}

// ─── Hook de datos ──────────────────────────────────────────────────────────────
function useHistorial(filters, pagination, sort) {
  const [data, setData] = useState({ total: 0, registros: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ── Integración real con backend ──────────────────────────────────────
      // const qs = buildQueryParams(filters, pagination, sort);
      // const res = await fetch(`${BASE_URL}/historial?${qs}`);
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const json = await res.json();
      // setData(json); // Espera { total: number, registros: [] }
      // ─────────────────────────────────────────────────────────────────────

      // Simulación con mock (eliminar cuando conectes backend)
      await new Promise((r) => setTimeout(r, 400));
      setData(MOCK_DATA);
    } catch (err) {
      setError(err.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function HistorialCambios() {
  // Filtros
  const [filters, setFilters] = useState({
    fechaDesde: '2024-05-01',
    fechaHasta: '2024-05-10',
    modulo: 'Todos',
    usuario: 'Todos',
    busqueda: '',
  });

  // Paginación
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  // Ordenamiento
  const [sort, setSort] = useState({ field: 'fecha', dir: 'desc' });

  const { data, loading, error, refetch } = useHistorial(filters, pagination, sort);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage: Number(perPage) });
  };

  const handleExport = async () => {
    // Integración real:
    // const qs = buildQueryParams(filters, pagination, sort);
    // window.open(`${BASE_URL}/historial/export?${qs}`, '_blank');
    alert('Exportar historial (conectar endpoint de export)');
  };

  // ── Paginación calculada ────────────────────────────────────────────────────
  const totalPages = Math.ceil(data.total / pagination.perPage);
  const startRecord = (pagination.page - 1) * pagination.perPage + 1;
  const endRecord = Math.min(pagination.page * pagination.perPage, data.total);

  const pageNumbers = buildPageNumbers(pagination.page, totalPages);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="historial-container">
      {/* Header */}
      <div className="historial-header">
        <h1>Historial de cambios</h1>
        <p>Consulta los cambios realizados en el sistema.</p>
      </div>

      {/* Toolbar */}
      <div className="historial-toolbar">
        {/* Fecha */}
        <div className="filter-group">
          <span className="filter-label">Fecha:</span>
          <input
            type="date"
            value={filters.fechaDesde}
            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
            title="Fecha inicio"
          />
          <span>-</span>
          <input
            type="date"
            value={filters.fechaHasta}
            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
            title="Fecha fin"
          />
        </div>

        {/* Módulo */}
        <div className="filter-group">
          <span className="filter-label">Módulo:</span>
          <select value={filters.modulo} onChange={(e) => handleFilterChange('modulo', e.target.value)}>
            {MODULOS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Usuario */}
        <div className="filter-group">
          <span className="filter-label">Usuario:</span>
          <select value={filters.usuario} onChange={(e) => handleFilterChange('usuario', e.target.value)}>
            {USUARIOS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        {/* Búsqueda */}
        <div className="filter-group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar en el historial…"
            value={filters.busqueda}
            onChange={(e) => handleFilterChange('busqueda', e.target.value)}
          />
        </div>

        <div className="filter-separator" />

        {/* Exportar */}
        <button className="btn-export" onClick={handleExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar
        </button>
      </div>

      {/* Tabla */}
      <div className="historial-table-wrapper">
        {error && <div className="empty-state">⚠️ {error}</div>}

        {!error && (
          <table className="historial-table">
            <thead>
              <tr>
                <SortableHeader label="Fecha y hora" field="fecha" sort={sort} onSort={handleSort} />
                <th>Usuario</th>
                <th>Módulo</th>
                <th>Acción</th>
                <th>Descripción</th>
                <th>IP origen</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="loading-state">
                      <div className="spinner" />
                      Cargando registros…
                    </div>
                  </td>
                </tr>
              ) : data.registros.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No se encontraron registros.</div>
                  </td>
                </tr>
              ) : (
                data.registros.map((row) => (
                  <tr key={row.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#6b7280', fontSize: '12.5px' }}>{row.fecha}</td>
                    <td style={{ fontWeight: 500 }}>{row.usuario}</td>
                    <td><span className="badge-modulo">{row.modulo}</span></td>
                    <td><span className={getBadgeClass(row.accion)}>{row.accion}</span></td>
                    <td><span className="desc-text" title={row.descripcion}>{row.descripcion}</span></td>
                    <td><span className="ip-text">{row.ip}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Footer paginación */}
        {!error && !loading && data.total > 0 && (
          <div className="historial-footer">
            <span>Mostrando {startRecord} a {endRecord} de {data.total} registros</span>

            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                title="Anterior"
              >‹</button>

              {pageNumbers.map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${p === pagination.page ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >{p}</button>
                )
              )}

              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                title="Siguiente"
              >›</button>
            </div>

            <div className="per-page-select">
              <select value={pagination.perPage} onChange={(e) => handlePerPageChange(e.target.value)}>
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} / pág.</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componentes ───────────────────────────────────────────────────────────
function SortableHeader({ label, field, sort, onSort }) {
  const active = sort.field === field;
  return (
    <th onClick={() => onSort(field)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="2.5"
        >
          {active && sort.dir === 'asc'
            ? <path d="M12 19V5M5 12l7-7 7 7" />
            : <path d="M12 5v14M5 12l7 7 7-7" />}
        </svg>
      </span>
    </th>
  );
}

// ─── Utilidad de paginación ────────────────────────────────────────────────────
function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}