export const logo = [
  '599 116',
  `<g>

    <defs>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ff6a00"/>
        <stop offset="100%" style="stop-color:#ff9500"/>
      </linearGradient>

      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#00c6ff"/>
        <stop offset="100%" style="stop-color:#0072ff"/>
      </linearGradient>

      <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b"/>
        <stop offset="100%" style="stop-color:#334155"/>
      </linearGradient>
    </defs>

    <!-- Servidor -->
    <g transform="translate(40,20)">
      <rect x="0" y="0" width="120" height="24" rx="4" fill="url(#serverGrad)" />
      <rect x="0" y="30" width="120" height="24" rx="4" fill="url(#serverGrad)" />
      <rect x="0" y="60" width="120" height="24" rx="4" fill="url(#serverGrad)" />

      <!-- luces -->
      <circle cx="95" cy="12" r="3" fill="#22c55e"/>
      <circle cx="105" cy="12" r="3" fill="#00c6ff"/>

      <circle cx="95" cy="42" r="3" fill="#22c55e"/>
      <circle cx="105" cy="42" r="3" fill="#00c6ff"/>

      <circle cx="95" cy="72" r="3" fill="#22c55e"/>
      <circle cx="105" cy="72" r="3" fill="#00c6ff"/>

      <!-- líneas -->
      <rect x="15" y="9" width="40" height="6" fill="#64748b"/>
      <rect x="15" y="39" width="40" height="6" fill="#64748b"/>
      <rect x="15" y="69" width="40" height="6" fill="#64748b"/>
    </g>

    <!-- Texto -->
    <text x="190" y="78"
          font-family="Arial, sans-serif"
          font-size="64"
          font-weight="bold">

      <tspan fill="url(#orangeGrad)">Infra</tspan>
      <tspan fill="url(#blueGrad)">Core</tspan>

    </text>

  </g>`,
]