import { useId } from "react";

export default function WaxSeal() {
  const uid = useId().replace(/:/g, "");
  const wax = `wax-${uid}`;
  const rim = `wax-rim-${uid}`;
  return (
    <div className="front-wax-seal" aria-hidden="true">
      <svg className="wax-stamp" viewBox="0 0 120 120" fill="none">
        <defs>
          <radialGradient id={wax} cx="32%" cy="24%" r="85%">
            <stop stopColor="#f1dfad" /><stop offset=".38" stopColor="#ceb277" />
            <stop offset=".76" stopColor="#a8874e" /><stop offset="1" stopColor="#876635" />
          </radialGradient>
          <linearGradient id={rim} x1=".15" y1="0" x2=".8" y2="1">
            <stop stopColor="#fff0c7" /><stop offset=".48" stopColor="#bea063" /><stop offset="1" stopColor="#7f6033" />
          </linearGradient>
        </defs>
        <path d="M60 7C70 5 75 10 83 12C90 13 92 22 99 27C106 32 105 42 110 50C115 58 108 65 109 74C109 82 100 86 96 94C91 102 81 101 73 108C65 113 57 108 49 111C40 113 35 104 27 102C18 99 19 89 12 82C6 75 10 66 7 58C4 49 12 43 13 34C14 25 24 24 30 17C36 10 45 14 52 9C55 7 57 8 60 7Z" fill={`url(#${wax})`} stroke={`url(#${rim})`} strokeWidth="2" />
        <circle cx="60" cy="59" r="41" stroke="#f6e4b6" strokeOpacity=".65" strokeWidth="2.8" />
        <circle cx="60" cy="60" r="37" fill="#aa874c" fillOpacity=".17" stroke="#846133" strokeWidth="1.6" />
        <circle cx="60" cy="60" r="34" stroke="#ead29c" strokeWidth=".8" />
        <g stroke="#805f34" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M48 83C67 67 72 49 68 35M52 78C46 67 43 55 46 43" />
          <path d="M62 64Q48 61 51 52Q63 53 62 64ZM67 52Q53 48 57 40Q69 43 67 52ZM69 42Q64 33 70 29Q76 36 69 42ZM65 60Q65 47 75 47Q78 56 65 60ZM57 73Q59 61 69 64Q69 73 57 73ZM47 57Q37 53 39 46Q49 48 47 57ZM49 67Q48 55 55 56Q60 64 49 67Z" fill="#b28e50" fillOpacity=".3" />
        </g>
        <path d="M31 32A38 38 0 0 1 78 26" stroke="#fff1cd" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
