import { useEffect, useRef, useState } from "react";

const VERTEX = `
attribute vec2 aUV;
uniform vec2 uViewport;
uniform float uImageWidth;
uniform float uTime;
uniform vec2 uOffset;
varying vec2 vUV;
varying float vLight;
varying float vOpacity;
float ease(float a, float b, float t) { return smoothstep(a, b, t); }
void main() {
  vec2 p = aUV;
  float t = max(uTime, 0.0);
  float tension = ease(0.05, 0.85, t);
  float unloop = ease(0.55, 1.65, t);
  float straighten = ease(0.95, 2.35, t);
  float release = ease(1.8, 4.15, t);
  float side = (p.x - 0.5) / (abs(p.x - 0.5) + 0.008);
  float center = 1.0 - ease(0.018, 0.055, abs(p.x - 0.505));
  float knot = center * (1.0 - ease(0.025, 0.07, abs(p.y - 0.388)));
  float loop = (1.0 - ease(0.34, 0.405, p.y)) * ease(0.16, 0.3, p.x) * (1.0 - ease(0.7, 0.84, p.x));
  float tail = ease(0.42, 0.49, p.y);
  float tailDistance = clamp((p.y - 0.42) / 0.49, 0.0, 1.0);

  // The loop narrows towards the knot while retaining the original fabric UVs.
  p.x = mix(p.x, 0.505 + (p.x - 0.505) * 0.12, loop * unloop);
  p.y += loop * unloop * 0.055;
  p.x += side * tension * 0.007 * (1.0 - knot);
  p.y -= knot * tension * 0.004;

  // Pull each hanging end through the center into a continuous, stretched band.
  p.y = mix(p.y, 0.397 + tailDistance * 0.042, tail * straighten);
  p.x += side * tailDistance * 0.47 * straighten * tail;
  p.y += sin(tailDistance * 7.0 - t * 3.0) * 0.014 * tail * sin(straighten * 3.14159);
  p.x += side * release * 1.15 * (1.0 - knot * 0.6);
  p.y += side * release * release * (0.23 + abs(aUV.x - 0.5) * 0.25);
  p.y += sin(aUV.x * 11.0 - t * 4.0) * 0.025 * release * (1.0 - release);
  p.x += knot * ease(1.3, 2.6, t) * 0.24;
  p.y = mix(p.y, 0.4, knot * ease(1.0, 2.0, t) * 0.72);

  vec2 position = vec2(
    uViewport.x * 0.5 + (p.x - 0.5) * uImageWidth,
    uViewport.y * 0.52 + (p.y - 0.39) * uImageWidth * 0.6666667
  ) + uOffset;
  gl_Position = vec4(position.x / uViewport.x * 2.0 - 1.0, 1.0 - position.y / uViewport.y * 2.0, 0.0, 1.0);
  vUV = aUV;
  vLight = 1.0 + sin(aUV.x * 12.0 - t * 2.4) * 0.06 * release * (1.0 - release);
  vOpacity = 1.0 - knot * ease(1.9, 2.65, t);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D uTexture;
uniform float uShadow;
varying vec2 vUV;
varying float vLight;
varying float vOpacity;
void main() {
  vec4 fabric = texture2D(uTexture, vUV);
  vec3 color = mix(fabric.rgb * vLight, vec3(0.28, 0.21, 0.13), uShadow);
  gl_FragColor = vec4(color, fabric.a * vOpacity * mix(1.0, 0.12, uShadow));
}`;

export default function RibbonOpening({ stage }) {
  const canvasRef = useRef(null);
  const startRef = useRef(null);
  const openingAt = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (stage !== "opening") return;
    openingAt.current = performance.now() + 700;
    startRef.current?.();
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;
    let frame = 0;
    let disposed = false;
    let loaded = false;
    const resources = [];
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error("Ribbon renderer could not compile.");
      }
      resources.push(["deleteShader", shader]);
      return shader;
    };
    let program;
    try {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX);
      const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      program = gl.createProgram();
      resources.push(["deleteProgram", program]);
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Ribbon renderer could not link.");
    } catch {
      resources.forEach(([method, resource]) => gl[method](resource));
      return;
    }
    gl.useProgram(program);
    const uniforms = Object.fromEntries(["uViewport", "uImageWidth", "uTime", "uOffset", "uTexture", "uShadow"].map(name => [name, gl.getUniformLocation(program, name)]));
    const vertices = [];
    const columns = 160;
    const rows = 112;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const left = x / columns;
        const right = (x + 1) / columns;
        const top = y / rows;
        const bottom = (y + 1) / rows;
        vertices.push(left, top, right, top, left, bottom, right, top, right, bottom, left, bottom);
      }
    }
    const buffer = gl.createBuffer();
    resources.push(["deleteBuffer", buffer]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, "aUV");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    resources.push(["deleteTexture", texture]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uniforms.uTexture, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = () => {
      if (disposed || !loaded) return;
      const seconds = reducedMotion || openingAt.current === null ? 0 : Math.max(0, (performance.now() - openingAt.current) / 1000);
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const resolution = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(bounds.width * resolution);
      const height = Math.round(bounds.height * resolution);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.uViewport, width, height);
      gl.uniform1f(uniforms.uImageWidth, width * (window.innerWidth < 600 ? 1.5 : 1.35));
      gl.uniform1f(uniforms.uTime, seconds);
      gl.uniform1f(uniforms.uShadow, 1);
      gl.uniform2f(uniforms.uOffset, 0, 3 * resolution);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
      gl.uniform1f(uniforms.uShadow, 0);
      gl.uniform2f(uniforms.uOffset, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
      if (openingAt.current !== null && seconds < 4.3 && !reducedMotion) frame = requestAnimationFrame(draw);
    };
    startRef.current = () => { cancelAnimationFrame(frame); draw(); };
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      loaded = true;
      setReady(true);
      startRef.current?.();
    };
    image.src = "/assets/champagne-satin-bow.png";
    const resize = new ResizeObserver(() => startRef.current?.());
    resize.observe(canvas);
    const lost = (event) => { event.preventDefault(); loaded = false; cancelAnimationFrame(frame); setReady(false); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      image.onload = null;
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      startRef.current = null;
      resources.forEach(([method, resource]) => gl[method](resource));
    };
  }, []);

  return (
    <div className={`ribbon-performance ${ready ? "ribbon-ready" : "ribbon-fallback"}`} aria-hidden="true">
      <div className="ribbon-photograph"><img src="/assets/champagne-satin-bow.png" alt="" /></div>
      <canvas ref={canvasRef} className="ribbon-canvas" />
    </div>
  );
}
