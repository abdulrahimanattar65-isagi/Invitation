import { useEffect, useRef, useState } from "react";
import { loadImage } from "../lib/loadImage.js";

const WIDTH = 576, HEIGHT = 1024, FRAMES = 108, FPS = 24, PER_SHEET = 8;

// Canvas plays reference-derived frames; editable wording is separate React text.
export default function FloralRibbon({ stage, onComplete }) {
  const canvasRef = useRef(null);
  const playRef = useRef(null);
  const completeRef = useRef(onComplete);
  const [ready, setReady] = useState(false);
  completeRef.current = onComplete;
  useEffect(() => {
    let disposed = false, playing = false, animation = 0, delay = 0;
    let completed = false;
    const controller = new AbortController();
    let current = 0, lastTime = 0, elapsed = 0;
    let paintedImage = null, paintedLocal = 0;
    const sheets = new Map();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      playRef.current = () => completeRef.current?.();
      return () => { playRef.current = null; };
    }
    const load = (index) => {
      if (sheets.has(index)) return sheets.get(index);
      const promise = loadImage(`/assets/floral-invitation/ribbon-${String(index + 1).padStart(2, "0")}.jpg`, { signal: controller.signal });
      sheets.set(index, promise);
      promise.catch(() => {});
      return promise;
    };
    const render = () => {
      if (!paintedImage || disposed) return;
      const desktop = window.matchMedia("(min-width: 900px)").matches;
      const bounds = canvas.getBoundingClientRect();
      const resolution = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = desktop ? Math.max(1, Math.round(bounds.width * resolution)) : WIDTH;
      const height = desktop ? Math.max(1, Math.round(bounds.height * resolution)) : HEIGHT;
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      const scale = Math.max(width / WIDTH, height / HEIGHT);
      const drawWidth = WIDTH * scale, drawHeight = HEIGHT * scale;
      context.drawImage(paintedImage, paintedLocal % 4 * WIDTH, Math.floor(paintedLocal / 4) * HEIGHT, WIDTH, HEIGHT, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };
    const paint = async (frame) => {
      const index = Math.floor(frame / PER_SHEET);
      const image = await load(index);
      if (disposed) return;
      paintedImage = image;
      paintedLocal = frame % PER_SHEET;
      render();
      setReady(true);
      if (index < Math.ceil(FRAMES / PER_SHEET) - 1) load(index + 1);
      for (const key of sheets.keys()) if (key < index - 1) sheets.delete(key);
    };
    const finish = () => {
      if (disposed || completed) return;
      completed = true; playing = false;
      cancelAnimationFrame(animation); clearTimeout(delay);
      completeRef.current?.();
    };
    const tick = async (now) => {
      if (disposed || !playing) return;
      elapsed += Math.min(now - lastTime, 80);
      lastTime = now;
      const target = Math.min(FRAMES - 1, Math.floor(elapsed * FPS / 1000));
      if (target !== current) {
        try { await paint(target); } catch { finish(); return; }
        if (disposed) return;
        current = target;
        // Loading pauses the clock rather than skipping the satin movement.
        lastTime = performance.now();
      }
      if (current >= FRAMES - 1) { finish(); return; }
      animation = requestAnimationFrame(tick);
    };
    playRef.current = () => {
      if (playing || completed) return;
      playing = true;
      delay = window.setTimeout(() => {
        lastTime = performance.now();
        animation = requestAnimationFrame(tick);
      }, 750);
    };
    paint(0).catch(() => { if (playing) finish(); });
    const resize = new ResizeObserver(render);
    resize.observe(canvas);
    return () => {
      disposed = true; playing = false;
      controller.abort();
      cancelAnimationFrame(animation); clearTimeout(delay);
      resize.disconnect();
      paintedImage = null;
      sheets.clear(); playRef.current = null;
    };
  }, []);
  useEffect(() => { if (stage === "opening") playRef.current?.(); }, [stage]);
  return <canvas ref={canvasRef} className={`floral-ribbon ${ready ? "ready" : ""}`} width={WIDTH} height={HEIGHT} aria-hidden="true" />;
}
