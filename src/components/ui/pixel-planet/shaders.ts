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
uniform float uTime;
uniform float uGlitch;

// Deterministic pseudo-random in [0,1). Drives which bands tear, so the glitch
// stays reproducible frame to frame instead of shimmering arbitrarily.
float glitchHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Horizontal tear bands. Kept to the cell grid so the band edges land between
// glyph rows rather than slicing a row in half.
//
// The band is deliberately wide (a fifth of the height) and one of the two is
// force-opened. At the original 0.045 half-width with both bands behind the same
// gate, a tear often landed on a band whose random centre fell outside the
// planet and nothing visibly moved at all — which is indistinguishable from the
// effect not working.
float glitchBand(float row, float seed) {
  float band = glitchHash(vec2(seed, 11.3));
  return step(abs(row - band), 0.15);
}

// Same luminance-to-character mapping as the branch's Canvas2D renderer.
// The shift argument displaces the sampling centre in UV space; the glyph mask
// itself is still read at the undisplaced position so characters never shear.
vec4 cellAt(vec2 uv, vec2 shift) {
  vec2 center = (floor(uv * uGrid) + 0.5) / uGrid + shift;
  vec2 d = 0.25 / uGrid;
  return (texture2D(uScene, center + vec2(-d.x,-d.y))
    + texture2D(uScene, center + vec2(d.x,-d.y))
    + texture2D(uScene, center + vec2(-d.x,d.y))
    + texture2D(uScene, center + vec2(d.x,d.y))) * 0.25;
}

void main() {
  /*
   * Glitch. The clock is quantised into slots and each slot gets a fresh seed,
   * so the effect is a discrete flicker rather than a smooth wobble.
   *
   * A slot either tears or it does not — uGlitch is that probability (0
   * disables the pass, 1 tears every slot). There is deliberately no second
   * gate inside the tearing slots: an inner gate multiplied the odds down until
   * a tear often landed on a band whose random centre fell off the planet, and
   * nothing visibly moved at all, which looks exactly like the effect being
   * broken.
   *
   * 8Hz rather than a per-frame value: a tear has to persist across a few
   * frames to be legible as a fault. At ~30fps a 13Hz slot lasted two frames
   * and read as a barely-visible haze.
   */
  float slot = floor(uTime * 8.0);
  float gate = step(1.0 - uGlitch, glitchHash(vec2(slot, 7.31)));
  float row = floor(vUv.y * uGrid.y);
  float band = max(glitchBand(row, slot), glitchBand(row, slot + 53.0));

  /*
   * Per-cell selection, so a burst corrupts an arbitrary scatter of characters
   * rather than the whole planet at once. Each glyph cell is hashed against the
   * slot seed and keeps its own value for the whole slot, so the churn reads as
   * a static (video-like) fault rather than noise crawling over the surface.
   *
   * Thresholded on luma (computed below) so the sparsity holds to ~35% of a
   * band's cells instead of every cell.
   */
  vec2 cellId = floor(vUv * uGrid);
  float cellPick = glitchHash(cellId + vec2(slot * 0.37, slot * 0.11));

  float offset = (glitchHash(vec2(slot, 19.7)) - 0.5) * 0.1 * gate * band;
  vec2 shift = vec2(offset, 0.0);
  /*
   * Dispersion offset, scaled with the tear so a wider tear also fringes wider.
   * It has to clear roughly one cell (cellWidth / canvasWidth, ~0.011 at 680px)
   * to be visible at all: cellAt snaps its sample to a cell centre, so any
   * offset smaller than a cell rounds away and the channels do not separate.
   */
  float split = 0.028 * gate * band;

  vec4 cell = cellAt(vUv, shift);
  float silhouette = texture2D(uScene, vUv).a;
  if (cell.a < 0.015 || silhouette < 0.015) discard;

  vec3 color = cell.rgb / max(cell.a, 0.001);
  color = clamp((color + uBrightness - 0.5) * uContrast + 0.5, 0.0, 1.0);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float value = clamp(luma + 0.08, 0.0, 1.0);

  // Resolve the per-cell pick now that luma is known, and vary the amount of
  // dispersion between cells so a burst is not a uniform tint.
  float speckle = step(cellPick, 0.35);
  float amount = 0.75 + glitchHash(cellId + vec2(9.13, slot * 0.23)) * 0.5;
  float glitchStrength = gate * band * speckle;

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

  /*
   * Edge dispersion.
   *
   * A plain RGB split does nothing useful here: the glyph palette is warm
   * (sand/cream ink, blue at roughly a third of red), so re-sampling the blue
   * channel moves it by almost nothing and the fringes come out one-sided.
   *
   * Instead the glyph coverage is re-read at two laterally-offset positions and
   * the *result* is tinted, red to one side and cyan to the other. Tinting the
   * coverage rather than the colour is what makes it a true edge dispersion:
   * the fringe lands where the character's edge has moved, so a stroke reads as
   * a red fringe on one side and a cyan one on the other regardless of ink.
   *
   * The offset is in UV, not pixels: 0.028 is ~19px at a 680px-wide canvas. It
   * has to clear roughly one cell (cellWidth / canvasWidth, ~0.011 at 680px)
   * before it does anything at all, because cellAt snaps its sample to a cell
   * centre and a sub-cell offset rounds away.
   */
  if (glitchStrength > 0.0) {
    vec4 warmCell = cellAt(vUv, shift + vec2(split, 0.0));
    vec4 coolCell = cellAt(vUv, shift - vec2(split, 0.0));
    // The glyph index is taken from each offset sample, so the fringes are the
    // neighbouring characters' shapes rather than a scaled copy of this one.
    float warmGlyph = min(uGlyphCount - 1.0, floor(clamp(dot(warmCell.rgb / max(warmCell.a, 0.001), vec3(1.0)) + 0.08, 0.0, 1.0) * uGlyphCount));
    float coolGlyph = min(uGlyphCount - 1.0, floor(clamp(dot(coolCell.rgb / max(coolCell.a, 0.001), vec3(1.0)) + 0.08, 0.0, 1.0) * uGlyphCount));
    float warmInk = texture2D(uGlyphs, vec2((warmGlyph + withinCell.x) / uGlyphCount, withinCell.y)).a;
    float coolInk = texture2D(uGlyphs, vec2((coolGlyph + withinCell.x) / uGlyphCount, withinCell.y)).a;

    float strength = glitchStrength * amount;
    color += vec3(1.0, -0.25, -0.25) * (warmInk * 0.85 * strength);
    color += vec3(-0.25, 0.35, 1.0) * (coolInk * 0.85 * strength);
    color = clamp(color, 0.0, 1.0);
  }

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
`
