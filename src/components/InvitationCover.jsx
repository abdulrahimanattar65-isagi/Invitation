import { useRef, useState } from "react";
import { wedding as w } from "../config.js";

export default function InvitationCover({ stage, onOpen, onOpened, onRevealComplete }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    <section className={`invitation-cover gate-cover gate-${stage}`} aria-label="Wedding invitation gate"
      onTransitionEnd={event => {
        if (stage === "revealing" && event.target === event.currentTarget && event.propertyName === "opacity") onRevealComplete();
      }}>
      <div className={`gate-scene ${playing ? "is-playing" : ""}`}>
        <video
          ref={videoRef}
          className="gate-video"
          src="/assets/gate/opening.mp4"
          poster="/assets/gate/poster.jpg"
          preload="auto"
          playsInline
          muted
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={event => {
            const video = event.currentTarget;
            // Blend into the page while the final frames are still moving.
            if (stage === "opening" && Number.isFinite(video.duration) && video.duration > 1 && video.duration - video.currentTime <= 0.7) onOpened();
          }}
          onEnded={onOpened}
          onError={() => { setFailed(true); if (stage === "opening") onOpened(); }}
          aria-hidden="true"
        />
        <img className="gate-poster" src="/assets/gate/poster-hq.png" alt="" aria-hidden="true" fetchPriority="high" decoding="async"
          onError={event => { if (event.currentTarget.src.endsWith("poster-hq.png")) event.currentTarget.src = "/assets/gate/poster.jpg"; }} />
        <div className="gate-initials" aria-label={`${w.bride} and ${w.groom}`} lang="en">{w.initials.replace("&", " & ")}</div>
        {stage === "closed" && <button type="button" className="gate-enter" onClick={enter} aria-label={`Open ${w.bride} and ${w.groom}'s wedding invitation`}>
          <span className="gate-welcome" lang="en">Together with our families</span>
          <span className="gate-enter-names" lang="en">{w.bride} <span>&amp;</span> {w.groom}</span>
          <span className="gate-date" lang="en">{w.dateDisplay.split("-").map(part => part.padStart(2, "0")).join(" · ")}</span>
          <span className="gate-enter-label">निमंत्रण उघडण्यासाठी स्पर्श करा <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg></span>
        </button>}
        {stage === "opening" && <button type="button" className="gate-skip" onClick={onOpened}>Skip intro →</button>}
      </div>
    </section>
  );
}
