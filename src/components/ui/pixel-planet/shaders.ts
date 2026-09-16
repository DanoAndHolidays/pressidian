export const surfaceVertex = /* glsl */ `
varying vec3 vPosition;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vPosition = position;
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const noise = /* glsl */ `
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float value = 0.0, amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += noise3(p) * amplitude;
    p = p * 2.03 + 7.1;
    amplitude *= 0.5;
  }
  return value;
}
`

export const planetFragment = /* glsl */ `
varying vec3 vPosition;
varying vec3 vWorld;
varying vec3 vNormal;
uniform vec3 uLight;
uniform vec3 uRingNormal;
uniform float uTime;
uniform float uWaveAmplitude;
${noise}
void main() {
  vec3 n = normalize(vNormal);
  vec3 p = normalize(vPosition);
  float turbulence = fbm(p * vec3(4.0, 7.0, 4.0));
  float latitude = p.y + (turbulence - 0.5) * 0.13;
  float band = sin(latitude * 28.0 + fbm(p * 6.0) * 2.0);
  float filaments = sin(latitude * 115.0 + turbulence * 9.0) * 0.5 + 0.5;
  vec3 sand = vec3(0.76, 0.55, 0.37);
  vec3 cream = vec3(0.96, 0.84, 0.65);
  vec3 blue = vec3(0.36, 0.44, 0.51);
  vec3 color = mix(sand, cream, smoothstep(-0.85, 0.9, band));
  color = mix(color, blue, smoothstep(0.45, 0.9, sin(latitude * 13.0 + 1.9)) * 0.52);
  color *= 0.92 + 0.08 * filaments;
  float diffuse = max(dot(n, uLight), 0.0);

  // Intersect the light ray with the equatorial ring plane: the ring casts
  // a narrow shadow onto the sphere, independent of texture coordinates.
  float t = -dot(vWorld, uRingNormal) / dot(uLight, uRingNormal);
  float ringRadius = length(vWorld + uLight * t);
  float ringShadow = step(0.01, t) * smoothstep(1.28, 1.36, ringRadius)
    * (1.0 - smoothstep(2.0, 2.08, ringRadius));
  diffuse *= 1.0 - ringShadow * 0.48;
  color *= 0.22 + 0.82 * diffuse;
  color += vec3(0.07, 0.095, 0.14) * (1.0 - diffuse);
  float rim = pow(1.0 - max(dot(n, normalize(cameraPosition - vWorld)), 0.0), 3.5);
  color += vec3(0.17, 0.13, 0.07) * rim * diffuse;
  float wave = sin(latitude * 12.0 - uTime * 1.1) * uWaveAmplitude;
  gl_FragColor = vec4(color * (1.0 + wave), 1.0);
}
`

export const ringFragment = /* glsl */ `
varying vec3 vPosition;
varying vec3 vWorld;
varying vec3 vNormal;
uniform vec3 uLight;
void main() {
  float radius = length(vPosition.xy);
  float fraction = (radius - 1.32) / (2.08 - 1.32);
  float stripe = sin(radius * 220.0) * 0.5 + 0.5;
  float fine = sin(radius * 531.0) * 0.5 + 0.5;
  float gap = 1.0 - smoothstep(0.012, 0.025, abs(radius - 1.78));
  float edge = smoothstep(0.0, 0.055, fraction) * (1.0 - smoothstep(0.96, 1.0, fraction));
  float alpha = (0.58 + stripe * 0.25 + fine * 0.08) * edge * (1.0 - gap * 0.97);
  vec3 color = mix(vec3(0.48, 0.43, 0.39), vec3(0.87, 0.76, 0.58), stripe * 0.45 + 0.45);
  color *= 0.75 + fine * 0.12;
  // A sphere-ray intersection places the planet's shadow on the far rings.
  float b = dot(vWorld, uLight);
  float discriminant = b * b - dot(vWorld, vWorld) + 1.0;
  if (discriminant > 0.0 && -b - sqrt(discriminant) > 0.0) color *= 0.28;
  gl_FragColor = vec4(color, alpha);
}
`

export const postVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const postFragment = /* glsl */ `
varying vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uGlyphs;
uniform float uGlyphCount;
uniform float uDark;
uniform vec2 uGrid;
uniform float uBrightness;
uniform float uContrast;
uniform float uVignette;
uniform float uBloom;

// Same luminance-to-character mapping as the branch's Canvas2D renderer.
// Sample the live scene, then use the glyph texture as an alpha mask.
vec4 cellAt(vec2 uv) {
  vec2 center = (floor(uv * uGrid) + 0.5) / uGrid;
  vec2 d = 0.25 / uGrid;
  return (texture2D(uScene, center + vec2(-d.x,-d.y))
    + texture2D(uScene, center + vec2(d.x,-d.y))
    + texture2D(uScene, center + vec2(-d.x,d.y))
    + texture2D(uScene, center + vec2(d.x,d.y))) * 0.25;
}
void main() {
  vec4 cell = cellAt(vUv);
  float silhouette = texture2D(uScene, vUv).a;
  if (cell.a < 0.015 || silhouette < 0.015) discard;
  vec3 color = cell.rgb / max(cell.a, 0.001);
  color = clamp((color + uBrightness - 0.5) * uContrast + 0.5, 0.0, 1.0);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float value = clamp(luma + 0.08, 0.0, 1.0);
  float glyph = min(uGlyphCount - 1.0, floor(value * uGlyphCount));
  vec2 withinCell = fract(vUv * uGrid);
  float ink = texture2D(uGlyphs, vec2((glyph + withinCell.x) / uGlyphCount, withinCell.y)).a;
  float alpha = ink * min(cell.a * 1.6, silhouette);
  if (alpha < 0.01) discard;

  // Restrained orange ink on paper; warm luminous glyphs in the dark theme.
  // The light stops are kept deep: on the warm paper a brighter highlight
  // (#d16e2e) sat too close to the canvas tone and the glyphs washed out.
  vec3 shadow = mix(vec3(0.42, 0.19, 0.07), vec3(0.65, 0.34, 0.17), uDark);
  vec3 highlight = mix(vec3(0.66, 0.29, 0.10), vec3(1.0, 0.77, 0.52), uDark);
  color = mix(shadow, highlight, smoothstep(0.1, 0.95, luma));
  vec2 fromCenter = (vUv - 0.5) * 1.4;
  color *= 1.0 - uVignette * dot(fromCenter, fromCenter);
  // Keep the bloom inside the glyphs so their counters and spacing stay crisp.
  color += highlight * uBloom * smoothstep(0.65, 1.0, luma) * 0.25;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
`
