import Crest from "./Crest.jsx";
import OrnateCorners from "./OrnateCorners.jsx";
import { wedding as w } from "../config.js";

const fmt = (o) => new Date(w.dateISO).toLocaleDateString("en-GB", o);

export default function Envelope({ stage, onOpen, initials }) {
  return (
    <div className={`env-wrap ${stage}`} onClick={stage === "closed" ? onOpen : undefined}>
      <p className="tap-hint">Tap the crest to open</p>

      <div className="folio">
        <div className="velvet folio-board">
          <div className="velvet-nap" />
          <div className="velvet-light" />

          <div className="acrylic acrylic-insert">
            <div className="glass-sheen" />
            <OrnateCorners />
            <div className="acrylic-copy">
              <p className="caps tiny">{w.hostLine}</p>
              <p className="small italic ghost">{w.inviteLine}</p>
              <h2 className="script foil names">{w.bride}</h2>
              <span className="amp">&amp;</span>
              <h2 className="script foil names">{w.groom}</h2>
              <div className="rule" />
              <p className="caps tiny">{fmt({ month: "long", day: "numeric" })}</p>
              <p className="script foil venue-sm">{w.venue}</p>
              <p className="caps tiny">{w.address.split(",").pop()?.trim()}</p>
            </div>
          </div>

          <div className="velvet pocket">
            <div className="velvet-nap" />
            <div className="pocket-gold" />
          </div>

          <div className="env-seal">
            <Crest initials={initials} size={128} />
          </div>
        </div>
      </div>
    </div>
  );
}
