import { useEffect, useRef, useState } from "react";

export default function GallerySlideshow({ photos }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const root = useRef(null);
  const pointerStart = useRef(null);
  const count = photos.length;
  const move = step => setCurrent(index => (index + step + count) % count);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(root.current);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (count < 2 || paused || hovered || focused || !visible || reducedMotion) return;
    const timer = window.setInterval(() => setCurrent(index => (index + 1) % count), 2000);
    return () => window.clearInterval(timer);
  }, [count, paused, hovered, focused, visible, reducedMotion, current]);

  if (!count) return null;
  return (
    <div ref={root} className="gallery-slideshow" role="region" aria-roledescription="carousel" aria-label="Ekta and Yashji photo gallery"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="couple-gallery-print gallery-slideshow-frame"
        tabIndex={count > 1 ? 0 : undefined}
        role="group"
        aria-label="Photos. Use left and right arrow keys to browse; space to pause or play."
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          if (event.key === " ") { event.preventDefault(); setPaused(value => !value); }
        }}
        onPointerDown={event => { pointerStart.current = event.clientX; }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onPointerUp={event => {
          if (pointerStart.current !== null && Math.abs(event.clientX - pointerStart.current) > 45) move(event.clientX < pointerStart.current ? 1 : -1);
          pointerStart.current = null;
        }}>
        {photos.map((photo, index) => <div key={photo.src} className={`gallery-slide ${index === current ? "is-active" : ""}`} aria-hidden={index !== current}>
          <img src={photo.src} alt={photo.alt} draggable="false" loading="lazy" />
        </div>)}
      </div>
      {photos[current].caption && <p className="gallery-slide-caption">{photos[current].caption}</p>}
    </div>
  );
}
