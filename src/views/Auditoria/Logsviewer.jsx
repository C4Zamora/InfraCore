// LogsViewer.jsx
// Vista de logs del sistema — lista para integración con backend.
// Para conectar: reemplaza fetchLogs() con tu llamada real a la API.
// Los filtros, paginación y búsqueda se traducen a query params REST.

import { useState, useEffect, useCallback, useRef } from 'react';
import '../../Styles/logsViewer.css';

// ─── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = '/api/v1'; // Ajusta a tu URL base

const LEVELS   = ['ALL', 'CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'];
const SERVICES = ['Todos', 'api-gateway', 'auth-service', 'db-replica', 'scheduler', 'mailer', 'storage'];
const HOSTS    = ['Todos', 'SRV-WEB-01', 'SRV-WEB-02', 'SRV-WEB-03', 'SRV-DB-01', 'SRV-DB-02'];
const PER_PAGE = [50, 100, 200, 500];

// ─── Estilos por nivel ──────────────────────────────────────────────────────────
const LEVEL_STYLES = {
  CRITICAL: { color: 'var(--critical)', bg: 'var(--critical-bg)', rowColor: 'var(--critical)' },
  ERROR:    { color: 'var(--error)',    bg: 'var(--error-bg)',    rowColor: 'var(--error)'    },
  WARN:     { color: 'var(--warn)',     bg: 'var(--warn-bg)',     rowColor: 'var(--warn)'     },
  INFO:     { color: 'var(--info)',     bg: 'var(--info-bg)',     rowColor: 'var(--info)'     },
  DEBUG:    { color: 'var(--debug)',    bg: 'var(--debug-bg)',    rowColor: 'var(--debug)'    },
};

// ─── Mock data (eliminar al conectar backend) ───────────────────────────────────
function generateMockLogs(count = 50) {
  const msgs = {
    CRITICAL: [
      'OOM Killer activado: proceso db-replica eliminado por memoria insuficiente',
      'Fallo de disco en SRV-DB-02: dispositivo /dev/sdb no responde',
      'Conexiones de BD agotadas: pool de 200 conexiones al 100%',
    ],
    ERROR: [
      'Timeout en llamada a auth-service: 30s excedidos',
      'JWT inválido — token expirado para usuario juan.perez',
      'Error 500 en POST /api/v1/solicitudes: null pointer exception',
      'Fallo al enviar email de alerta: SMTP connection refused',
    ],
    WARN: [
      'Uso de CPU al 87% en SRV-WEB-03 durante los últimos 5 min',
      'Caché Redis con 95% de capacidad — considerar purga',
      'Certificado SSL vence en 7 días: *.sistema.interno',
      'Rate limit aplicado a IP 192.168.1.200: 1200 req/min',
    ],
    INFO: [
      'Backup diario completado exitosamente en SRV-DB-02 (12.3 GB)',
      'Usuario admin inició sesión desde 192.168.1.100',
      'Servicio scheduler reiniciado correctamente',
      'Deploy v2.4.1 completado en SRV-WEB-01 y SRV-WEB-02',
      'Tarea de limpieza de logs ejecutada: 2.1 GB liberados',
    ],
    DEBUG: [
      'Query ejecutada en 142ms: SELECT * FROM servidores WHERE estado=1',
      'Cache HIT para clave session:abc123 — TTL 298s restantes',
      'Health check OK: todos los servicios responden',
      'Worker thread #4 procesó 120 mensajes en 1.2s',
    ],
  };

  const services  = ['api-gateway', 'auth-service', 'db-replica', 'scheduler', 'mailer', 'storage'];
  const hosts     = ['SRV-WEB-01', 'SRV-WEB-02', 'SRV-WEB-03', 'SRV-DB-01', 'SRV-DB-02'];
  const levelKeys = ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'];
  const weights   = [0.02, 0.08, 0.15, 0.55, 0.20];

  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const rand = Math.random();
    let cum = 0;
    let level = 'INFO';
    for (let j = 0; j < levelKeys.length; j++) {
      cum += weights[j];
      if (rand < cum) { level = levelKeys[j]; break; }
    }
    const msgArr = msgs[level];
    const ts = new Date(now - i * 8000 - Math.random() * 5000);

    return {
      id:        `LOG-${String(count - i).padStart(5, '0')}`,
      timestamp:  ts.toISOString(),
      level,
      service:   services[Math.floor(Math.random() * services.length)],
      host:      hosts[Math.floor(Math.random() * hosts.length)],
      message:   msgArr[Math.floor(Math.random() * msgArr.length)],
      traceId:   `${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      pid:       Math.floor(Math.random() * 30000 + 1000),
      duration:  level === 'DEBUG' ? `${Math.floor(Math.random() * 500)}ms` : null,
      meta: {
        requestId: `req-${Math.random().toString(36).slice(2, 14)}`,
        userId:    Math.random() > .5 ? `usr_${Math.floor(Math.random() * 9999)}` : null,
        ip:        `192.168.${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 200) + 1}`,
        env:       'production',
        version:   'v2.4.1',
      },
    };
  });
}

const ALL_MOCK = generateMockLogs(200);

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatTs(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
  const time = d.toLocaleTimeString('es-CO', { hour12: false });
  return { date, time };
}

function buildQueryParams(filters, pagination, search) {
  const p = new URLSearchParams();
  if (filters.level !== 'ALL')     p.append('level',    filters.level);
  if (filters.service !== 'Todos') p.append('service',  filters.service);
  if (filters.host !== 'Todos')    p.append('host',     filters.host);
  if (filters.desde)               p.append('from',     filters.desde);
  if (filters.hasta)               p.append('to',       filters.hasta);
  if (search)                      p.append('q',        search);
  p.append('page',    pagination.page);
  p.append('perPage', pagination.perPage);
  return p.toString();
}

function countByLevel(logs) {
  return logs.reduce((acc, l) => { acc[l.level] = (acc[l.level] || 0) + 1; return acc; }, {});
}

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="msg-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Hook principal ─────────────────────────────────────────────────────────────
function useLogs(filters, pagination, search) {
  const [data, setData]     = useState({ logs: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ── Integración real ───────────────────────────────────────────────────
      // const qs = buildQueryParams(filters, pagination, search);
      // const res = await fetch(`${BASE_URL}/logs?${qs}`, {
      //   headers: { Authorization: `Bearer ${getToken()}` }
      // });
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const json = await res.json();
      // setData({ logs: json.data, total: json.total });
      // ──────────────────────────────────────────────────────────────────────

      // Simulación mock
      await new Promise(r => setTimeout(r, 300));

      let filtered = ALL_MOCK;
      if (filters.level !== 'ALL')     filtered = filtered.filter(l => l.level === filters.level);
      if (filters.service !== 'Todos') filtered = filtered.filter(l => l.service === filters.service);
      if (filters.host !== 'Todos')    filtered = filtered.filter(l => l.host === filters.host);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(l =>
          l.message.toLowerCase().includes(q) ||
          l.service.toLowerCase().includes(q) ||
          l.traceId.toLowerCase().includes(q)
        );
      }

      const total = filtered.length;
      const start = (pagination.page - 1) * pagination.perPage;
      const logs  = filtered.slice(start, start + pagination.perPage);
      setData({ logs, total });
    } catch (e) {
      setError(e.message || 'Error al cargar los logs');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { data, loading, error, refetch: fetchLogs };
}

// ─── Componente principal ───────────────────────────────────────────────────────
export default function LogsViewer() {
  const [filters, setFilters] = useState({
    level: 'ALL', service: 'Todos', host: 'Todos',
    desde: '', hasta: '',
  });
  const [search, setSearch]       = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination]   = useState({ page: 1, perPage: 50 });
  const [selectedLog, setSelectedLog] = useState(null);
  const [liveMode, setLiveMode]       = useState(false);
  const liveRef = useRef(null);

  const { data, loading, error, refetch } = useLogs(filters, pagination, search);

  // Live mode polling
  useEffect(() => {
    if (liveMode) {
      liveRef.current = setInterval(refetch, 5000); // Cada 5s — ajusta según backend
    } else {
      clearInterval(liveRef.current);
    }
    return () => clearInterval(liveRef.current);
  }, [liveMode, refetch]);

  // Conteos por nivel (sobre todos los mock para el statsbar)
  const levelCounts = countByLevel(ALL_MOCK);

  // Handlers
  const setLevel = (level) => {
    setFilters(p => ({ ...p, level }));
    setPagination(p => ({ ...p, page: 1 }));
    setSelectedLog(null);
  };

  const setFilter = (key, val) => {
    setFilters(p => ({ ...p, [key]: val }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleExport = () => {
    // const qs = buildQueryParams(filters, pagination, search);
    // window.open(`${BASE_URL}/logs/export?${qs}`, '_blank');
    alert('Conectar endpoint de exportación');
  };

  const totalPages = Math.ceil(data.total / pagination.perPage);
  const pageNums   = buildPageNums(pagination.page, totalPages);
  const start      = (pagination.page - 1) * pagination.perPage + 1;
  const end        = Math.min(pagination.page * pagination.perPage, data.total);

  return (
    <div className="logs-root">
      {/* ── Top bar ── */}
      <header className="logs-topbar">
        <div className="topbar-brand">
          <div className="brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <div>
            <div className="brand-title">SysLog Viewer</div>
            <div className="brand-sub">Monitor de logs del sistema</div>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className={`live-badge ${liveMode ? '' : 'inactive'}`}
            onClick={() => setLiveMode(v => !v)}
          >
            <span className="live-dot" />
            {liveMode ? 'LIVE' : 'OFFLINE'}
          </button>

          <button className="btn-icon" onClick={refetch} title="Refrescar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>

          <button className="btn-primary" onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar
          </button>
        </div>
      </header>

      {/* ── Stats bar ── */}
      <div className="logs-statsbar">
        {[
          { key: 'ALL',      label: 'Total',    count: ALL_MOCK.length,            color: 'var(--accent)'   },
          { key: 'CRITICAL', label: 'Critical', count: levelCounts.CRITICAL || 0,  color: 'var(--critical)' },
          { key: 'ERROR',    label: 'Error',    count: levelCounts.ERROR    || 0,  color: 'var(--error)'    },
          { key: 'WARN',     label: 'Warn',     count: levelCounts.WARN     || 0,  color: 'var(--warn)'     },
          { key: 'INFO',     label: 'Info',     count: levelCounts.INFO     || 0,  color: 'var(--info)'     },
          { key: 'DEBUG',    label: 'Debug',    count: levelCounts.DEBUG    || 0,  color: 'var(--debug)'    },
        ].map(s => (
          <div
            key={s.key}
            className={`stat-item ${filters.level === s.key ? 'active' : ''}`}
            style={{ '--level-color': s.color }}
            onClick={() => setLevel(s.key)}
          >
            <span className="stat-dot" style={{ background: s.color }} />
            <div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-count ${s.key !== 'ALL' ? 'colored' : ''}`}
                   style={s.key !== 'ALL' ? { color: s.color } : {}}>
                {s.count.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="logs-body">
        {/* Sidebar */}
        <aside className="logs-sidebar">
          {/* Nivel */}
          <div>
            <div className="sidebar-section-title">Nivel</div>
            <div className="filter-chip-group">
              {LEVELS.map(lv => {
                const s = LEVEL_STYLES[lv];
                return (
                  <button
                    key={lv}
                    className={`filter-chip ${filters.level === lv ? 'active' : ''}`}
                    style={{ '--level-color': s?.color || 'var(--accent)', '--level-bg': s?.bg || 'var(--accent-dim)' }}
                    onClick={() => setLevel(lv)}
                  >
                    <span className="chip-left">
                      {s && <span className="chip-dot" style={{ background: s.color }} />}
                      {lv === 'ALL' ? 'Todos' : lv}
                    </span>
                    <span className="chip-badge">{lv === 'ALL' ? ALL_MOCK.length : (levelCounts[lv] || 0)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Servicio */}
          <div>
            <div className="sidebar-section-title">Servicio</div>
            <select className="sidebar-select" value={filters.service} onChange={e => setFilter('service', e.target.value)}>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Host */}
          <div>
            <div className="sidebar-section-title">Host</div>
            <select className="sidebar-select" value={filters.host} onChange={e => setFilter('host', e.target.value)}>
              {HOSTS.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>

          {/* Rango fecha */}
          <div>
            <div className="sidebar-section-title">Rango de tiempo</div>
            <div className="date-row">
              <input type="datetime-local" className="sidebar-input"
                value={filters.desde} onChange={e => setFilter('desde', e.target.value)} />
              <input type="datetime-local" className="sidebar-input"
                value={filters.hasta} onChange={e => setFilter('hasta', e.target.value)} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="logs-main">
          {/* Search */}
          <form className="logs-searchbar" onSubmit={handleSearch}>
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="search-input"
                placeholder='Buscar en mensajes, trace ID, servicio… (Enter para buscar)'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <span className="search-hint" style={{ cursor: 'pointer' }}
                  onClick={() => { setSearchInput(''); setSearch(''); }}>✕</span>
              )}
            </div>
            <button type="submit" className="btn-sm">Buscar</button>
            <button type="button" className="btn-sm" onClick={() => {
              setFilters({ level: 'ALL', service: 'Todos', host: 'Todos', desde: '', hasta: '' });
              setSearch(''); setSearchInput('');
            }}>Limpiar</button>
          </form>

          {/* Column headers */}
          <div className="logs-colheader">
            <span>Timestamp</span>
            <span>Nivel</span>
            <span>Servicio</span>
            <span>Host</span>
            <span>Mensaje</span>
            <span>Trace ID</span>
          </div>

          {/* Log list */}
          <div className="logs-list">
            {loading ? (
              <div className="logs-loading">
                <div className="spinner-ring" />
                Cargando logs…
              </div>
            ) : error ? (
              <div className="logs-empty">⚠️ {error}</div>
            ) : data.logs.length === 0 ? (
              <div className="logs-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity:.3 }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                Sin registros para los filtros aplicados
              </div>
            ) : (
              data.logs.map(log => {
                const s  = LEVEL_STYLES[log.level] || {};
                const ts = formatTs(log.timestamp);
                return (
                  <div
                    key={log.id}
                    className={`log-row ${selectedLog?.id === log.id ? 'selected' : ''}`}
                    style={{ '--row-color': s.rowColor }}
                    onClick={() => setSelectedLog(l => l?.id === log.id ? null : log)}
                  >
                    <div className="cell cell-timestamp">
                      <span className="ts-date">{ts.date}</span>
                      <span className="ts-time">{ts.time}</span>
                    </div>
                    <div className="cell cell-level">
                      <span className="level-badge" style={{ '--lcolor': s.color, '--lbg': s.bg }}>
                        <span className="level-dot" />
                        {log.level}
                      </span>
                    </div>
                    <div className="cell cell-service">{log.service}</div>
                    <div className="cell cell-host">{log.host}</div>
                    <div className="cell cell-message">
                      {highlight(log.message, search)}
                    </div>
                    <div className="cell cell-trace">
                      <span className="trace-id">{log.traceId}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail drawer */}
          {selectedLog && (
            <div className="log-detail">
              <div className="detail-header">
                <span className="detail-title">
                  ▸ {selectedLog.id} — {selectedLog.level}
                </span>
                <button className="detail-close" onClick={() => setSelectedLog(null)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="detail-body">
                <div className="detail-meta">
                  {[
                    ['Timestamp',  selectedLog.timestamp],
                    ['Nivel',      selectedLog.level],
                    ['Servicio',   selectedLog.service],
                    ['Host',       selectedLog.host],
                    ['PID',        selectedLog.pid],
                    ['Trace ID',   selectedLog.traceId],
                    ['Request ID', selectedLog.meta.requestId],
                    ['User ID',    selectedLog.meta.userId || '—'],
                    ['IP origen',  selectedLog.meta.ip],
                    ['Entorno',    selectedLog.meta.env],
                    ['Versión',    selectedLog.meta.version],
                    ...(selectedLog.duration ? [['Duración', selectedLog.duration]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="meta-row">
                      <span className="meta-key">{k}</span>
                      <span className="meta-value mono">{v}</span>
                    </div>
                  ))}
                  <div className="meta-row" style={{ gridTemplateColumns: '1fr' }}>
                    <span className="meta-key">Mensaje</span>
                    <span className="meta-value" style={{ marginTop: 4 }}>{selectedLog.message}</span>
                  </div>
                </div>
                <div className="detail-raw">
                  <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="logs-footer">
            <div className="footer-left">
              <span>
                {loading ? 'Cargando…' : `${start}–${end} de ${data.total.toLocaleString()} registros`}
              </span>
              {[
                { l: 'CRITICAL', c: 'var(--critical)' },
                { l: 'ERROR',    c: 'var(--error)'    },
                { l: 'WARN',     c: 'var(--warn)'     },
              ].map(s => (levelCounts[s.l] || 0) > 0 && (
                <span key={s.l} className="footer-stat">
                  <span className="footer-dot" style={{ background: s.c }} />
                  {levelCounts[s.l]} {s.l}
                </span>
              ))}
            </div>

            <div className="pagination">
              <button className="pg-btn" disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>‹</button>
              {pageNums.map((p, i) =>
                p === '…' ? <span key={`e${i}`} style={{ color: 'var(--txt-muted)', padding: '0 3px' }}>…</span>
                : <button key={p} className={`pg-btn ${p === pagination.page ? 'active' : ''}`}
                    onClick={() => setPagination(pr => ({ ...pr, page: p }))}>{p}</button>
              )}
              <button className="pg-btn" disabled={pagination.page === totalPages || totalPages === 0}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>›</button>
            </div>

            <div className="per-page">
              <span>Mostrar:</span>
              <select value={pagination.perPage}
                onChange={e => setPagination({ page: 1, perPage: Number(e.target.value) })}>
                {PER_PAGE.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// ─── Utilidad paginación ────────────────────────────────────────────────────────
function buildPageNums(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}