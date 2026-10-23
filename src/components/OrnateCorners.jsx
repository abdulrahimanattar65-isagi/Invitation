/** Gold-foil baroque corners like the acrylic invitation. */
export default function OrnateCorners() {
  const corner = (
    <g fill="url(#foilGrad)" stroke="url(#foilSoft)" strokeWidth="0.4">
      <path d="M8 28 C8 16 16 8 28 8 L34 8 C30 8 26 10 24 14 C20 12 16 14 14 18 C12 22 14 26 18 28 C14 26 10 24 8 28 Z" />
      <path d="M10 22 C14 14 22 10 30 10" fill="none" />
      <path d="M12 18 C18 12 26 10 32 11" fill="none" />
      <circle cx="16" cy="16" r="1.4" />
      <path d="M20 8 C22 4 28 3 32 6 C28 5 24 7 22 10 Z" />
      <path d="M8 20 C4 22 3 28 6 32 C5 28 7 24 10 22 Z" />
    </g>
  );
  return (
    <svg className="ornate-corners" viewBox="0 0 200 280" preserveAspectRatio="none" aria-hidden="true">
      <g>{corner}</g>
      <g transform="translate(200,0) scale(-1,1)">{corner}</g>
      <g transform="translate(0,280) scale(1,-1)">{corner}</g>
      <g transform="translate(200,280) scale(-1,-1)">{corner}</g>
    </svg>
  );
}
