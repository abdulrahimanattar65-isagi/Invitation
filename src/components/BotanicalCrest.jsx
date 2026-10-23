import { useId } from "react";

// Open, asymmetric olive branches inspired by embroidered wedding monograms.
function Branch({ start, end, count, radius, leafSize }) {
  const point = (angle) => {
    const radians = angle * Math.PI / 180;
    return [100 + radius * Math.cos(radians), 100 + radius * Math.sin(radians)];
  };
  const [sx, sy] = point(start);
  const [ex, ey] = point(end);
  return (
    <g>
      <path d={`M${sx} ${sy} A${radius} ${radius} 0 0 1 ${ex} ${ey}`} fill="none" />
      {Array.from({ length: count }, (_, i) => {
        const angle = start + (end - start) * (i + .45) / count;
        const [x, y] = point(angle);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[angle - 28, angle + 154].map((rotation, side) => (
              <g key={side} transform={`rotate(${rotation}) scale(${leafSize * (i % 3 === 0 ? .85 : 1)})`}>
                <path d="M0 0Q5 -1 8 -3" fill="none" />
                <path d="M5 -2Q8 -8 17 -6Q13 0 5 -2Z" fillOpacity=".22" />
                <path d="M6 -2L15 -6" fill="none" strokeWidth=".45" />
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function BotanicalCrest({ initials = "C&S", size = 140, className = "" }) {
  const id = `botanical-gold-${useId().replace(/:/g, "")}`;
  const letters = initials.replace(/[^\p{L}\p{N}]/gu, "");
  return (
    <svg className={`crest ${className}`} viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`${initials} botanical wedding monogram`}>
      <defs>
        <linearGradient id={id} x1="18" y1="20" x2="175" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--monogram-highlight, #fff8e1)" /><stop offset=".25" stopColor="var(--monogram-mid, #e8c56a)" />
          <stop offset=".46" stopColor="var(--monogram-highlight, #fff1c2)" /><stop offset=".73" stopColor="var(--monogram-dark, #c9a24a)" />
          <stop offset="1" stopColor="var(--monogram-highlight, #f6e7b0)" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} fill={`url(#${id})`} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round">
        <Branch start={-106} end={105} count={15} radius={62} leafSize={.95} />
        <Branch start={124} end={225} count={8} radius={59} leafSize={.8} />
        <path d="M82 161q-8 9-15 9M66 148q-15 4-19 12M55 69q-7-10-5-18" fill="none" />
        <path d="M67 170q-10 0-13 8 11-1 13-8ZM49 158q-9-4-16 1 8 6 16-1ZM50 53q-7-5-4-14 7 5 4 14Z" fillOpacity=".25" />
      </g>
      <text x="100" y="105" textAnchor="middle" dominantBaseline="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize={letters.length > 3 ? 24 : 32} fontWeight="400" letterSpacing="2" fill={`url(#${id})`}>{letters}</text>
    </svg>
  );
}
