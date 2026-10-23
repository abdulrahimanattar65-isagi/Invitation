import { useEffect, useRef, useState } from "react";
import { wedding as w } from "./config.js";
import InvitationCover from "./components/InvitationCover.jsx";
import Crest from "./components/Crest.jsx";
import Countdown from "./components/Countdown.jsx";
import TextureDefs from "./components/TextureDefs.jsx";
import EmbossedFrame from "./components/EmbossedFrame.jsx";

const fmt = (o) => new Date(w.dateISO).toLocaleDateString("en-GB", o);

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className={`reveal ${on ? "in" : ""} ${className}`}>
      {children}
    </section>
  );
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
    const timer = window.setTimeout(() => setStage("open"), 1100);
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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) openingTimer.current = setTimeout(() => setStage("open"), 150);
  };

  return (
    <div className={`app experience-${stage}`}>
      <TextureDefs />
        <main className="page">
          <section className="hero" ref={heroRef} tabIndex={-1} aria-label="Wedding invitation">
            <div className="velvet folio-open">
              {stage !== "open" && <InvitationCover stage={stage} onOpen={open} onOpened={() => setStage(current => current === "opening" ? "revealing" : current)} />}
              <div className="velvet-nap" />
              <div className="velvet-light" />

              <div className="acrylic">
                <div className="glass-sheen" />
                <EmbossedFrame />
                <div className="hero-crest">
                  <Crest initials={w.initials} size={112} />
                </div>
                <div className="hero-copy">
                <p className="small caps">{w.hostLine}</p>
                <p className="small italic ghost">{w.inviteLine}</p>
                <div className="couple-names">
                  <h1 className="script foil">{w.bride}</h1>
                  <span className="amp">&amp;</span>
                  <h1 className="script foil">{w.groom}</h1>
                </div>
                <div className="rule" />
                <p className="caps date">{fmt({ weekday: "long" })}</p>
                <p className="date-big foil">{fmt({ day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="small caps">
                  {new Date(w.dateISO).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })}
                </p>
                <p className="script foil venue-hero">{w.venue}</p>
                <p className="small caps hero-address">
                  <span>{w.address.split(",")[0]}</span>
                  <span>{w.address.split(",").slice(1).join(",").trim()}</span>
                </p>
                </div>
              </div>
            </div>
            <p className="scroll-invitation">Scroll to discover our day <span aria-hidden="true">↓</span></p>
          </section>

          <div className="event-details" aria-hidden={stage !== "open"} {...(stage !== "open" ? { inert: "" } : {})}>
          <Reveal>
            <h2 className="script foil h2">Countdown</h2>
            <Countdown target={w.dateISO} />
          </Reveal>

          <Reveal>
            <h2 className="caps h2s">Location</h2>
            <p className="script foil venue">{w.venue}</p>
            <p className="small caps">{w.address}</p>
            <p className="body">{w.venueNote}</p>
            <a className="btn" href={w.mapUrl} target="_blank" rel="noreferrer">
              Get Directions
            </a>
          </Reveal>

          <Reveal className="day-section">
            <h2 className="script foil h2">The Day</h2>
            <ul className="timeline">
              {w.timeline.map((t) => (
                <li key={t.time + t.title} className="velvet">
                  <span className="velvet-nap" />
                  <span className="caps tm">{t.time}</span>
                  <b className="caps">{t.title}</b>
                  <em>{t.note}</em>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="dress-code">
            <h2 className="caps h2s">Dress Code</h2>
            <p className="script foil venue">{w.dressCode.title}</p>
            <p className="body">{w.dressCode.note}</p>
          </Reveal>

          <Reveal className="rsvp">
            <div className="velvet rsvp-card">
              <div className="velvet-nap" />
              <Crest initials={w.initials} size={96} />
              <h2 className="caps h2s">RSVP</h2>
              <p className="body">Kindly reply by {w.rsvp.by}</p>
              <p className="small caps">{w.rsvp.contact}</p>
              <a
                className="btn"
                href={`https://wa.me/${w.rsvp.whatsapp}?text=${encodeURIComponent("We'll be there to celebrate with you!")}`}
                target="_blank"
                rel="noreferrer"
              >
                RSVP on WhatsApp
              </a>
            </div>
          </Reveal>
          </div>
        </main>
    </div>
  );
}
