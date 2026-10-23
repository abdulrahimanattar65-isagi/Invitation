/** Shared SVG filters + patterns for velvet nap and gold foil. */
export default function TextureDefs() {
  return (
    <svg className="texture-defs" aria-hidden="true">
      <defs>
        <filter id="velvetNap" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="a">
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="a" mode="overlay" />
        </filter>
        <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="22%" stopColor="#e8c56a" />
          <stop offset="45%" stopColor="#f8edd0" />
          <stop offset="62%" stopColor="#c9a24a" />
          <stop offset="82%" stopColor="#8a6a1f" />
          <stop offset="100%" stopColor="#f0d78a" />
        </linearGradient>
        <linearGradient id="foilSoft" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f4e4b8" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a67c2a" />
        </linearGradient>
        <radialGradient id="glassShine" cx="22%" cy="12%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
