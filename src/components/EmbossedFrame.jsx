export default function EmbossedFrame() {
  const spray = (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M15 145C10 87 25 27 95 17M19 100C40 72 61 47 99 35M35 57C49 41 70 31 91 30" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${21 + i * 7} ${112 - i * 11}) rotate(${i * 7 - 35})`}>
          <path d="M0 0Q-18-7-13-21Q0-16 0 0ZM0 0Q16-3 18-16Q3-16 0 0Z" fill="currentColor" fillOpacity=".07" />
          <path d="M0 0l-11-17M0 0l15-13" opacity=".5" />
        </g>
      ))}
      <path d="M20 140q17-15 28-8t-1 19q-16 5-20-9M66 26q-7-17 4-18t12 16M87 21q6-17 17-11t-1 16" />
    </g>
  );
  return (
    <svg className="embossed-frame" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="paper-relief"><feDropShadow dx="0" dy="1" stdDeviation=".6" floodColor="#fffdf5" floodOpacity=".9" /></filter>
      </defs>
      <g filter="url(#paper-relief)">
        {spray}
        <g transform="translate(400 0) scale(-1 1)">{spray}</g>
        <g transform="translate(0 600) scale(1 -1)">{spray}</g>
        <g transform="translate(400 600) scale(-1)">{spray}</g>
        <path d="M200 35C180 52 155 36 145 62Q140 79 118 80Q68 82 63 139V461Q68 518 118 520Q140 521 145 538C155 564 180 548 200 565C220 548 245 564 255 538Q260 521 282 520Q332 518 337 461V139Q332 82 282 80Q260 79 255 62C245 36 220 52 200 35Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M200 43C178 60 158 45 152 67Q145 87 121 88Q77 90 72 141V459Q77 510 121 512Q145 513 152 533C158 555 178 540 200 557C222 540 242 555 248 533Q255 513 279 512Q323 510 328 459V141Q323 90 279 88Q255 87 248 67C242 45 222 60 200 43Z" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".65" />
      </g>
    </svg>
  );
}
