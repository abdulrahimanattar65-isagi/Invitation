import { useRef, useState } from "react";
import { wedding as w } from "../config.js";

export default function InvitationCover({ stage, onOpen, onOpened }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  const enter = () => {
    if (stage !== "closed") return;
    onOpen();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (failed || !videoRef.current) {
      onOpened();
      return;
    }
    // Start directly from the tap so mobile browsers permit inline playback.
    videoRef.current.play()?.catch(() => onOpened());
  };

  return (
    <section className={`invitation-cover gate-cover gate-${stage}`} aria-label="Wedding invitation gate">
      <div className="gate-scene">
        <video
          ref={videoRef}
          className="gate-video"
          src="/assets/gate/opening.mp4"
          poster="/assets/gate/poster.jpg"
          preload="auto"
          playsInline
          muted
          onEnded={onOpened}
          onError={() => { setFailed(true); if (stage === "opening") onOpened(); }}
          aria-hidden="true"
        />
        <div className="gate-initials" aria-label={`${w.bride} and ${w.groom}`} lang="en">{w.initials.replace("&", " & ")}</div>
        {stage === "closed" && <button type="button" className="gate-enter" onClick={enter} aria-label={`Open ${w.bride} and ${w.groom}'s wedding invitation`}>
          <span className="gate-enter-label">निमंत्रण उघडण्यासाठी स्पर्श करा</span>
          <span className="gate-enter-names" lang="en">{w.bride} &amp; {w.groom}</span>
        </button>}
        {stage === "opening" && <button type="button" className="gate-skip" onClick={onOpened}>Skip intro →</button>}
      </div>
    </section>
  );
}
