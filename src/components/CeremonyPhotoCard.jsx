import { useEffect, useRef, useState } from "react";

export default function CeremonyPhotoCard({ event }) {
  const cardRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const slide = direction => {
    const track = trackRef.current;
    track.scrollBy({ left: direction * track.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <article ref={cardRef} className={`ceremony-photo-card ${event.photoLayout === "portrait" ? "ceremony-photo-portrait" : ""} ${visible ? "is-visible" : ""}`} aria-label={event.title}>
      <div ref={trackRef} className="ceremony-photo-track" aria-label={`${event.title} photos`} tabIndex={event.images.length > 1 ? 0 : undefined}>
        {event.images.map(photo => <div className="ceremony-photo-slide" key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" width={photo.width || 1672} height={photo.height || 941} /></div>)}
      </div>
      <div className={`ceremony-photo-copy ${event.photoCopyPosition === "bottom" ? "ceremony-photo-copy-bottom" : ""}`}>
        {event.photoEyebrow !== "" && <p className="ceremony-photo-eyebrow">{event.photoEyebrow || "An Auspicious Beginning"}</p>}
        <h3>{event.title}</h3>
        {event.date && <p className="ceremony-photo-date">{event.date}</p>}
        {event.time && <p>{event.time}</p>}
        {event.note && <p>{event.note}</p>}
      </div>
      {event.images.length > 1 && <div className="ceremony-photo-controls">
        <button type="button" onClick={() => slide(-1)} aria-label="Previous photo">←</button>
        <button type="button" onClick={() => slide(1)} aria-label="Next photo">→</button>
      </div>}
    </article>
  );
}
