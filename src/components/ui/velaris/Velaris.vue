<script setup lang="ts">
/**
 * Velaris — animated simplex-noise backdrop with colour blending, a vignette
 * glow and film grain.
 *
 * Ported to Vue from the original React component. The upgrade over the source
 * version: the render loop pauses when the canvas scrolls out of view or the
 * tab is backgrounded, the device pixel ratio is clamped, and the whole effect
 * collapses to a static CSS gradient for reduced-motion visitors or on devices
 * without WebGL — so it can sit behind real content without costing frames.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    bg?: string
    colors?: string[]
    speed?: number
    grain?: number
    height?: string
    class?: string
    /** Drop the canvas entirely and render the static gradient fallback. */
    staticFallback?: boolean
  }>(),
  {
    bg: '#000000',
    colors: () => ['#86efac', '#4ade80', '#059669', '#000000'],
    speed: 2,
    grain: 0.3,
    height: '100vh',
    class: undefined,
    staticFallback: false,
  },
)

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const active = ref(false)
const failed = ref(false)

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);

  vec3 col = u_bg;

  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
  col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`

/** Parsed colours are memoised — the render loop must not allocate. */
let parsedBg: [number, number, number] = [0, 0, 0]
let parsedColors = new Float32Array(12)
let parsedKey = ''

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '').trim()
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value.padEnd(6, '0')
  return [
    Number.parseInt(full.slice(0, 2), 16) / 255,
    Number.parseInt(full.slice(2, 4), 16) / 255,
    Number.parseInt(full.slice(4, 6), 16) / 255,
  ]
}

function refreshPalette() {
  const key = `${props.bg}|${props.colors.join(',')}`
  if (key === parsedKey) return
  parsedKey = key
  parsedBg = hexToRgb(props.bg)
  const slots = props.colors.slice(0, 4)
  while (slots.length < 4) slots.push(slots.at(-1) ?? '#000000')
  parsedColors = new Float32Array(slots.flatMap(hexToRgb))
}

const fallbackStyle = computed(() => ({
  background: `radial-gradient(120% 110% at 22% 12%, ${props.colors[0] ?? '#f0642f'} 0%, transparent 55%),
    radial-gradient(95% 95% at 82% 28%, ${props.colors[1] ?? '#f0642f'} 0%, transparent 52%),
    radial-gradient(130% 120% at 50% 108%, ${props.colors[2] ?? '#b84924'} 0%, transparent 58%),
    ${props.bg}`,
}))

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let raf: number | null = null
let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let tabVisible = true
let startedAt = 0
let elapsed = 0
let onVisibility: (() => void) | null = null

const uniform = {
  res: null as WebGLUniformLocation | null,
  time: null as WebGLUniformLocation | null,
  grain: null as WebGLUniformLocation | null,
  colors: null as WebGLUniformLocation | null,
  bg: null as WebGLUniformLocation | null,
}

function compile(type: number, source: string): WebGLShader | null {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function init(): boolean {
  const canvas = canvasRef.value
  if (!canvas) return false

  gl = (canvas.getContext('webgl', { antialias: false, alpha: false, depth: false }) ??
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  if (!gl) return false

  const vertex = compile(gl.VERTEX_SHADER, vertexShaderGLSL)
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentShaderGLSL)
  if (!vertex || !fragment) return false

  program = gl.createProgram()
  if (!program) return false
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  uniform.res = gl.getUniformLocation(program, 'u_resolution')
  uniform.time = gl.getUniformLocation(program, 'u_time')
  uniform.grain = gl.getUniformLocation(program, 'u_grain')
  uniform.colors = gl.getUniformLocation(program, 'u_colors')
  uniform.bg = gl.getUniformLocation(program, 'u_bg')

  resize()
  return true
}

function resize() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container || !gl) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.round(container.clientWidth * dpr))
  const height = Math.max(1, Math.round(container.clientHeight * dpr))
  if (canvas.width === width && canvas.height === height) return
  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)
}

function frame(timestamp: number) {
  raf = null
  if (!gl || !canvasRef.value) return
  if (!startedAt) startedAt = timestamp
  elapsed = (timestamp - startedAt) / 1000

  refreshPalette()
  gl.uniform2f(uniform.res, canvasRef.value.width, canvasRef.value.height)
  gl.uniform1f(uniform.time, elapsed * props.speed)
  gl.uniform1f(uniform.grain, props.grain)
  gl.uniform3f(uniform.bg, parsedBg[0], parsedBg[1], parsedBg[2])
  gl.uniform3fv(uniform.colors, parsedColors)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  schedule()
}

function schedule() {
  if (raf != null) return
  if (!active.value || !tabVisible) return
  raf = requestAnimationFrame(frame)
}

function pause() {
  if (raf != null) cancelAnimationFrame(raf)
  raf = null
}

onMounted(() => {
  if (props.staticFallback) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    failed.value = true
    return
  }
  if (!init()) {
    failed.value = true
    return
  }

  const container = containerRef.value
  if (!container) return

  observer = new IntersectionObserver(
    (entries) => {
      active.value = entries.some((entry) => entry.isIntersecting)
      if (active.value) {
        // Resume from where we paused instead of jumping the noise field.
        startedAt = performance.now() - elapsed * 1000
        schedule()
      } else {
        pause()
      }
    },
    { threshold: 0.02 },
  )
  observer.observe(container)

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(container)

  onVisibility = () => {
    tabVisible = document.visibilityState !== 'hidden'
    if (!tabVisible) pause()
    else {
      startedAt = performance.now() - elapsed * 1000
      schedule()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  pause()
  observer?.disconnect()
  resizeObserver?.disconnect()
  if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('resize', resize)
  if (gl && program) gl.deleteProgram(program)
  gl = null
  program = null
})

watch(
  () => props.staticFallback,
  (value) => {
    if (!value) return
    pause()
    failed.value = true
  },
)
</script>

<template>
  <div
    ref="containerRef"
    :style="{ height }"
    :class="cn('relative w-full overflow-hidden bg-forest', props.class)"
    :data-velaris="failed ? 'static' : 'live'"
  >
    <div
      v-if="failed || staticFallback"
      class="absolute inset-0 animate-[drift_28s_ease-in-out_infinite]"
      :style="fallbackStyle"
      aria-hidden="true"
    />
    <canvas
      v-else
      ref="canvasRef"
      class="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </div>
</template>
