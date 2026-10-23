export function loadImage(src, { signal, timeoutMs = 4500 } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Image loading cancelled", "AbortError"));
      return;
    }
    const image = new Image();
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve(image);
    };
    const abort = () => finish(new DOMException("Image loading cancelled", "AbortError"));
    const timer = setTimeout(() => finish(new Error("Image loading timed out")), timeoutMs);
    image.onload = () => finish();
    image.onerror = () => finish(new Error("Image unavailable"));
    signal?.addEventListener("abort", abort, { once: true });
    image.src = src;
  });
}
