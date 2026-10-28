import { useEffect, useRef, useState } from "react";
import { wedding as w } from "./config.js";
import InvitationCover from "./components/InvitationCover.jsx";
import Countdown from "./components/Countdown.jsx";
import Karyakram from "./components/Karyakram.jsx";
import BlessingIntro from "./components/BlessingIntro.jsx";
import GallerySlideshow from "./components/GallerySlideshow.jsx";
import TextureDefs from "./components/TextureDefs.jsx";
import EmbossedFrame from "./components/EmbossedFrame.jsx";

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
  const openingTimer = useRef(null);
  const heroRef = useRef(null);
  useEffect(() => () => clearTimeout(openingTimer.current), []);
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
  useEffect(() => {
    if (stage === "open") heroRef.current?.focus({ preventScroll: true });
  }, [stage]);
  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      openingTimer.current = setTimeout(() => setStage("open"), 150);
    }
  };

  return (
    <div className={`app marathi-invitation experience-${stage}`} lang="mr">
      <TextureDefs />
      <main className="page">
        <section id="page-1" className="hero" ref={heroRef} tabIndex={-1} aria-label="शुभ विवाह — प्रथम पृष्ठ">
          <div className="velvet folio-open">
            {stage !== "open" && <InvitationCover stage={stage} onOpen={open} onOpened={() => setStage(current => current === "opening" ? "revealing" : current)} onRevealComplete={() => setStage(current => current === "revealing" ? "open" : current)} />}
            <div className="acrylic">
              <EmbossedFrame />
              <div className="hero-copy">
                <BlessingIntro />
                <p className="wedding-kicker">सस्नेह निमंत्रण</p>
                <h1 className="marathi-title">शुभ विवाह</h1>
                <p className="wedding-date">दिनांक : {w.dateDisplay}</p>
                <div className="marathi-couple">
                  <h2>{w.brideMarathi}</h2>
                  <span className="marathi-sang">संग</span>
                  <h2>{w.groomMarathi}</h2>
                </div>
                <p className="english-couple script" lang="en">{w.bride} &amp; {w.groom}</p>
                <div className="host-details">
                  <h3>निमंत्रक:</h3>
                  <Lines lines={w.hosts} />
                  <p className="phone-links">{w.phones.map((phone, index) => <span key={phone}>{index > 0 && " / "}<a href={`tel:+91${phone}`}>{phone}</a></span>)}</p>
                </div>
                <PageImages page={1} />
              </div>
            </div>
          </div>
          <p className="scroll-invitation">मंगल निमंत्रण पाहण्यासाठी खाली सरकवा <span aria-hidden="true">↓</span></p>
        </section>

        <div className="event-details" aria-hidden={stage !== "open"} {...(stage !== "open" ? { inert: "" } : {})}>
          <section className="invitation-sheet countdown-section" aria-labelledby="countdown-heading">
            <h2 id="countdown-heading" className="sheet-heading" lang="en">Countdown</h2>
            <p className="countdown-date">5 डिसेंबर 2026 · सायं 5:30 वाजता</p>
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
            <div className="reception-invitation"><h2 id="reception-heading" className="reception-heading">आशीर्वाद समारोह एवं प्रीतिभोज आमंत्रण :</h2><p>{w.reception}</p></div>
            <div className="wedding-location">
              <p className="wedding-kicker">विवाह स्थल</p>
              <h3>{w.venue}</h3>
              <p>{w.address}</p>
              <a className="location-link" href={w.mapUrl} target="_blank" rel="noreferrer" aria-label="दिशा देखें — Google Maps में विवाह स्थल तक का रास्ता खोलें">
                <span className="location-pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                </span>
                <span>दिशा देखें <span className="location-map-label" lang="en">Google Maps</span></span>
                <span className="location-arrow" aria-hidden="true">↗</span>
              </a>
              <p className="location-hint">यहाँ टैप करें और विवाह स्थल तक का रास्ता देखें</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
