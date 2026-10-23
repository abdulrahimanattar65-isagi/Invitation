import { wedding as w } from "../config.js";
import FloralRibbon from "./FloralRibbon.jsx";
import WaxSeal from "./WaxSeal.jsx";
import EmbossedFrame from "./EmbossedFrame.jsx";

export default function InvitationCover({ stage, onOpen, onOpened }) {
  return (
    <section className={`invitation-cover floral-cover ${stage === "revealing" ? "opening revealing" : stage}`} aria-label="Wedding invitation cover">
      <div className="cover-shell">
        <FloralRibbon stage={stage} onComplete={onOpened} />
        <div className="desktop-cover-frame" aria-hidden="true"><EmbossedFrame /></div>
        <h1 className="cover-invited script">You are invited</h1>
        <WaxSeal />
        <button className="cover-open" onClick={onOpen} disabled={stage !== "closed"} aria-label={`Open ${w.bride} and ${w.groom}'s wedding invitation`}>
          <span className="cover-prompt">{stage === "closed" ? "Touch the seal to open" : "With love, an invitation unfolds"}</span>
          <span className="cover-arrow" aria-hidden="true">&#8599;</span>
        </button>
      </div>
    </section>
  );
}
