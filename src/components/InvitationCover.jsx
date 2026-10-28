import { useRef, useState } from "react";
import { wedding as w } from "../config.js";

export default function InvitationCover({ stage, onOpen, onOpened, onRevealComplete }) {
  const videoRef = useRef(null);
  const startedRef = useRef(false);
  const touchStartRef = useRef(null);
  const wheelDistanceRef = useRef(0);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const enter = () => {
    if (stage !== "closed" || startedRef.current) return;
    startedRef.current = true;
    onOpen();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (failed || !videoRef.current) {
      onOpened();
      return;
    }
    // Start directly from the gesture so mobile browsers permit inline playback.
    videoRef.current.play()?.catch(() => onOpened());
  };

  return (
    <section className={`invitation-cover gate-cover gate-${stage}`} aria-label="Wedding invitation gate"
      onClick={enter}
      onWheel={event => {
        if (stage !== "closed") return;
        wheelDistanceRef.current += Math.abs(event.deltaY);
        if (wheelDistanceRef.current >= 12) enter();
      }}
      onTouchStart={event => {
        touchStartRef.current = stage === "closed" && event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null;
      }}
      onTouchMove={event => {
        const start = touchStartRef.current;
        if (!start || event.touches.length !== 1) return;
        const vertical = Math.abs(event.touches[0].clientY - start.y);
        const horizontal = Math.abs(event.touches[0].clientX - start.x);
        if (vertical >= 24 && vertical > horizontal) enter();
      }}
      onTouchEnd={() => { touchStartRef.current = null; }}
      onTouchCancel={() => { touchStartRef.current = null; }}
      onTransitionEnd={event => {
        if (stage === "revealing" && event.target === event.currentTarget && event.propertyName === "opacity") onRevealComplete();
      }}>
      <div className={`gate-scene ${playing ? "is-playing" : ""}`}>
        <video
          ref={videoRef}
          className="gate-video"
          src="/assets/gate/opening-hd.mp4"
          poster="/assets/gate/poster-hq.png"
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
          onError={event => { if (event.currentTarget.src.endsWith("poster-hq.png")) event.currentTarget.src = "/assets/gate/poster-hd.jpg"; }} />
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
