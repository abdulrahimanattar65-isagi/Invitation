import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { wedding as w } from "./config.js";
import InvitationCover from "./components/InvitationCover.jsx";
import Countdown from "./components/Countdown.jsx";
import Karyakram from "./components/Karyakram.jsx";
import BlessingIntro from "./components/BlessingIntro.jsx";
import GallerySlideshow from "./components/GallerySlideshow.jsx";
import TextureDefs from "./components/TextureDefs.jsx";
import EmbossedFrame from "./components/EmbossedFrame.jsx";

const receptionHighlight = "invited to the wedding feast on Saturday, 5 December 2026, from 5:15 PM";

function PageImages({ page }) {
  const images = w.pageImages[page];
  if (!images?.length) return null;
  return <div className="invitation-images">{images.map(image => (
    <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
  ))}</div>;
}

function Lines({ lines }) {
  return lines.map((line, index) => <p key={index}>{line}</p>);
}

export default function App() {
  const [stage, setStage] = useState("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const musicPreference = useRef(null);
  const openingTimer = useRef(null);
  const heroRef = useRef(null);
  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.4;
    audioRef.current.play()?.catch(() => {
      // A scroll may not grant audio permission; the music button can retry.
    });
  };
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      musicPreference.current = false;
      audio.pause();
    } else {
      musicPreference.current = true;
      playMusic();
    }
  };
  useEffect(() => () => clearTimeout(openingTimer.current), []);
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, []);
  useLayoutEffect(() => {
    // Reveal the first section before painting, even after a refresh farther down.
    if (stage === "revealing" || stage === "open") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    if (stage === "open") heroRef.current?.focus({ preventScroll: true });
  }, [stage]);
  useEffect(() => {
    if (stage !== "opening") return;
    // A stalled download or interrupted animation must never keep scrolling locked.
    const recovery = window.setTimeout(() => {
      setStage(current => current === "opening" ? "revealing" : current);
    }, 12000);
    return () => window.clearTimeout(recovery);
  }, [stage]);
  useEffect(() => {
    if (stage !== "revealing") return;
    // Transition completion normally opens the page; retain a fallback if the
    // browser suppresses the event (including reduced-motion preferences).
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setStage("open"), reducedMotion ? 0 : 1700);
    return () => window.clearTimeout(timer);
  }, [stage]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (stage !== "open") document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [stage]);
  const open = () => {
    if (stage !== "closed") return;
    if (musicPreference.current !== false) playMusic();
    setStage("opening");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      openingTimer.current = setTimeout(() => setStage("open"), 150);
    }
  };

  return (
    <div className={`app marathi-invitation english-invitation experience-${stage}`} lang="en">
      <TextureDefs />
      <audio ref={audioRef} src="/assets/music/o-sanam.mp3" loop preload="metadata"
        onPlaying={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)}
        onError={() => setMusicPlaying(false)} />
      <button type="button" className={`music-toggle${musicPlaying ? " is-playing" : ""}`}
        onClick={toggleMusic} aria-label={musicPlaying ? "Mute music" : "Play music"}
        aria-pressed={musicPlaying} title={musicPlaying ? "Mute music" : "Play music"}>
        <svg viewBox="-3 0 34 42" fill="currentColor" aria-hidden="true">
          <path d="M13 30V3h2c.8 6 3.4 9.1 7.5 12.8 5.8 5.3 5.2 11.5.6 17.2h-1.6c3.6-7.5 3.3-12.8-6.5-16.8v17.3c0 4-4 6.5-8.2 6.5C2.8 40 0 37.8 0 34.9c0-3.1 3.5-5.5 7.6-5.5 2.1 0 4 .3 5.4.6Z" />
          {!musicPlaying && <path d="m4 6 24 29" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />}
        </svg>
      </button>
      <main className="page">
        <section id="page-1" className="hero" ref={heroRef} tabIndex={-1} aria-label="Wedding invitation — first page">
          <div className="velvet folio-open">
            {stage !== "open" && <InvitationCover stage={stage} onOpen={open} onOpened={() => setStage(current => current === "opening" ? "revealing" : current)} onRevealComplete={() => setStage(current => current === "revealing" ? "open" : current)} />}
            <div className="acrylic">
              <EmbossedFrame />
              <div className="hero-copy">
                <BlessingIntro />
                <p className="wedding-kicker">You are cordially invited</p>
                <h1 className="marathi-title">Wedding Celebration</h1>
                <p className="wedding-date">Date: {w.dateDisplay}</p>
                <div className="marathi-couple">
                  <h2>{w.bride}</h2>
                  <span className="marathi-sang">&amp;</span>
                  <h2>{w.groom}</h2>
                </div>
                <div className="host-details">
                  <h3>With warm regards from:</h3>
                  <Lines lines={w.hosts} />
                  <p className="phone-links">{w.phones.map((phone, index) => <span key={phone}>{index > 0 && " / "}<a href={`tel:+91${phone}`}>{phone}</a></span>)}</p>
                </div>
                <PageImages page={1} />
              </div>
            </div>
          </div>
        </section>

        <div className="event-details" aria-hidden={stage !== "open"} {...(stage !== "open" ? { inert: "" } : {})}>
          <section className="invitation-sheet countdown-section" aria-labelledby="countdown-heading">
            <h2 id="countdown-heading" className="sheet-heading" lang="en">Countdown</h2>
            <p className="countdown-date">5 December 2026 · 5:30 PM</p>
            <div lang="en"><Countdown target={w.dateISO} /></div>
          </section>
          <Karyakram />
          <section id="from-the-couple" className="invitation-sheet couple-message-section" lang="en" aria-labelledby="couple-message-heading">
            <p className="couple-message-kicker">From the</p>
            <h2 id="couple-message-heading" className="couple-message-heading">Bride and Groom</h2>
            <div className="couple-message-copy"><Lines lines={w.coupleMessage} /></div>
            <p className="couple-message-signature script">{w.bride} &amp; {w.groom}</p>
            {w.gallery.length > 0 && <GallerySlideshow photos={w.gallery} />}
          </section>
          <section className="invitation-sheet" aria-labelledby="reception-heading">
            <div className="reception-invitation"><h2 id="reception-heading" className="reception-heading">Blessings Ceremony &amp; Wedding Feast</h2><p>{w.reception.split(receptionHighlight).map((part, index) => (
              <span key={index}>{index > 0 && <strong className="reception-highlight">{receptionHighlight}</strong>}{part}</span>
            ))}</p></div>
            <div className="wedding-location">
              <p className="wedding-kicker">Wedding Venue</p>
              <h3>{w.venue}</h3>
              <p>{w.address}</p>
              <a className="location-link" href={w.mapUrl} target="_blank" rel="noreferrer" aria-label="Get directions to the wedding venue in Google Maps">
                <span className="location-pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                </span>
                <span>Get Directions <span className="location-map-label" lang="en">Google Maps</span></span>
                <span className="location-arrow" aria-hidden="true">↗</span>
              </a>
              <p className="location-hint">Tap here for directions to the wedding venue</p>
              <div className="rsvp-details" lang="en">
                <p className="wedding-kicker">RSVP :</p>
                <p className="phone-links">MAHENDRA KUMAR VINAYAKIYA  <a href="tel:+919448116626">9448116626</a></p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
