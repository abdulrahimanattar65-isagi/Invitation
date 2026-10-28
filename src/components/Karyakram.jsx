import { wedding } from "../config.js";
import "../karyakram.css";

const ceremonyNames = ["Path Bithai", "Bandoli", "Sagai", "Sangeet", "Carnival", "Baraat", "Varmala", "Reception", "Panigrahan"];

function RoseSpray({ className }) {
  return <svg className={className} viewBox="0 0 260 240" fill="none" aria-hidden="true">
    <g stroke="#82916a" strokeWidth="1.3">
      <path d="M34 215Q80 120 224 30M68 170Q39 105 49 24M101 137Q166 147 241 104M130 109Q121 53 149 8" />
      <g fill="#8b9c79" stroke="none">
        <path d="M60 152Q12 143 21 101Q62 110 60 152M48 104Q17 73 39 39Q65 73 48 104M119 121Q137 82 174 83Q163 118 119 121M164 73Q176 34 216 30Q204 66 164 73M152 141Q186 117 221 140Q193 160 152 141M135 70Q114 33 148 8Q162 42 135 70M83 168Q109 138 136 160Q117 186 83 168" />
      </g>
    </g>
    {[{x:88,y:99,s:1},{x:145,y:163,s:.76},{x:57,y:181,s:.55}].map(({x,y,s}, i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0-45C19-58 36-36 34-26C61-20 51 12 39 18C42 46 13 54 0 40C-22 54-42 37-37 20C-62 6-46-24-34-26C-35-49-11-57 0-45Z" fill="#edc5b8" />
      <path d="M0-35C25-44 38-15 26-4C45 18 18 40 1 27C-18 44-39 15-25 1C-40-22-17-42 0-35Z" fill="#f8ded1" />
      <path d="M-17-18Q13-33 24-8Q29 18 3 24Q-24 21-23-2Q-16-23 7-17Q24-7 12 8Q-3 24-13 8Q-18-7 0-10Q15-8 7 3Q-2 11-5 2" stroke="#ce9c8b" strokeWidth="2.5" strokeLinecap="round" />
    </g>)}
    <g fill="#f0dbbd"><circle cx="194" cy="100" r="5"/><circle cx="210" cy="86" r="4"/><circle cx="224" cy="76" r="5"/><circle cx="39" cy="68" r="4"/></g>
  </svg>;
}

function EventDate({ date }) {
  const parts = date?.match(/^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/);
  if (!parts) return date ? <p className="karyakram-date-pending">{date}</p> : null;
  const year = parts[3].length === 2 ? `20${parts[3]}` : parts[3];
  return <time className="karyakram-date" dateTime={`${year}-${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}`}>
    <span className="karyakram-day">{parts[1].padStart(2, "0")}</span>
    <span className="karyakram-month">दिसंबर<span>{year}</span></span>
  </time>;
}

export default function Karyakram() {
  return <section id="page-4" className="invitation-sheet karyakram" aria-labelledby="schedule-heading">
    <RoseSpray className="karyakram-flowers karyakram-flowers-top" />
    <RoseSpray className="karyakram-flowers karyakram-flowers-bottom" />
    <header className="karyakram-header">
      <p className="ganesh-invocation">श्री गणेशाय नमः</p>
      <p className="karyakram-eyebrow" lang="en">A celebration of love & togetherness</p>
      <h2 id="schedule-heading">मांगलिक कार्यक्रम</h2>
      <p className="karyakram-subtitle" lang="en">The Wedding Celebrations</p>
      <span className="karyakram-flourish" aria-hidden="true">✦</span>
      <div className="sacred-verse">{wedding.ganeshVerse.map(line => <p key={line}>{line}</p>)}</div>
    </header>
    <ol className="karyakram-events">
      {wedding.timeline.map((event, index) => <li className="karyakram-event" key={event.title}>
        <div className="karyakram-art">
          {event.images?.[0] && <img src={event.images[0].src} alt={event.images[0].alt} loading="lazy" width={event.images[0].width} height={event.images[0].height} />}
        </div>
        <div className="karyakram-copy">
          <p className="karyakram-script" lang="en">{ceremonyNames[index]}</p>
          <h3>{event.title}</h3>
          <span className="karyakram-small-flourish" aria-hidden="true">♥</span>
          <EventDate date={event.date} />
          {event.time && <p className="karyakram-time">{event.time}</p>}
          {event.note && <p className="karyakram-venue">{event.note}</p>}
        </div>
      </li>)}
    </ol>
    <footer className="karyakram-footer"><span aria-hidden="true">✦</span><p>आपकी उपस्थिति ही हमारा सौभाग्य है</p></footer>
  </section>;
}
