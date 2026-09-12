import{c as G,d as q,a8 as H,a9 as K,e as C,r as y,w as T,o as W,b as Y,i as z,n as X,M as B,l as J,m as Q,h as Z,aa as ee,q as U}from"./index-D4eZ9aGh.js";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=G("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),te=["data-velaris"],re={class:"relative z-10 h-full w-full"},ae=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,oe=`
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform float u_glow;
uniform float u_vignette;
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

  float glow = smoothstep(0.8, 0.0, dist) * u_glow;
  col += u_colors[1] * glow;

  // 1.0 keeps the palette untouched; below that the corners fall away.
  col = mix(col * (1.0 - u_vignette * 0.8), col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`,le=q({__name:"Velaris",props:{bg:{default:"#000000"},colors:{default:()=>["#86efac","#4ade80","#059669","#000000"]},speed:{default:2},grain:{default:.3},height:{default:"100vh"},class:{default:void 0},glow:{default:.3},vignette:{default:.8},staticFallback:{type:Boolean,default:!1},themed:{type:Boolean,default:!0}},setup(b){const o=b,{isDark:I}=H(K()),N=t=>Array.isArray(t)&&typeof t[0]=="string",$=t=>Array.isArray(t)&&Array.isArray(t[0]),F=t=>Array.isArray(t),f=C(()=>{const t=o.themed&&I.value?1:0;return{bg:N(o.bg)?o.bg[t]:o.bg,colors:$(o.colors)?o.colors[t]:o.colors,glow:F(o.glow)?o.glow[t]:o.glow,vignette:F(o.vignette)?o.vignette[t]:o.vignette}}),_=y(null),s=y(null),A=y(!1),v=y(!1);let g=[0,0,0],M=new Float32Array(12),S="";function P(t){const a=t.replace("#","").trim(),r=a.length===3?a.split("").map(i=>i+i).join(""):a.padEnd(6,"0");return[Number.parseInt(r.slice(0,2),16)/255,Number.parseInt(r.slice(2,4),16)/255,Number.parseInt(r.slice(4,6),16)/255]}function V(){const{bg:t,colors:a}=f.value,r=`${t}|${a.join(",")}`;if(r===S)return;S=r,g=P(t);const i=a.slice(0,4);for(;i.length<4;)i.push(i.at(-1)??"#000000");M=new Float32Array(i.flatMap(P))}const D=C(()=>{const{bg:t,colors:a,glow:r}=f.value,i=Math.round(Math.min(.9,.35+r)*100);return{background:`radial-gradient(75% 70% at 38% 42%, ${a[1]} 0%, transparent ${i}%),
      radial-gradient(120% 110% at 22% 12%, ${a[0]} 0%, transparent 55%),
      radial-gradient(130% 120% at 50% 108%, ${a[2]} 0%, transparent 58%),
      ${t}`}});let e=null,n=null,c=null,k=null,L=null,R=!0,d=0,m=0,h=null;const l={res:null,time:null,grain:null,glow:null,vignette:null,colors:null,bg:null};function E(t,a){if(!e)return null;const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function O(){const t=s.value;if(!t||(e=t.getContext("webgl",{antialias:!1,alpha:!1,depth:!1})??t.getContext("experimental-webgl"),!e))return!1;const a=E(e.VERTEX_SHADER,ae),r=E(e.FRAGMENT_SHADER,oe);if(!a||!r||(n=e.createProgram(),!n)||(e.attachShader(n,a),e.attachShader(n,r),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS)))return!1;e.useProgram(n);const i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const u=e.getAttribLocation(n,"position");return e.enableVertexAttribArray(u),e.vertexAttribPointer(u,2,e.FLOAT,!1,0,0),l.res=e.getUniformLocation(n,"u_resolution"),l.time=e.getUniformLocation(n,"u_time"),l.grain=e.getUniformLocation(n,"u_grain"),l.glow=e.getUniformLocation(n,"u_glow"),l.vignette=e.getUniformLocation(n,"u_vignette"),l.colors=e.getUniformLocation(n,"u_colors"),l.bg=e.getUniformLocation(n,"u_bg"),p(),!0}function p(){const t=s.value,a=_.value;if(!t||!a||!e)return;const r=Math.min(window.devicePixelRatio||1,2),i=Math.max(1,Math.round(a.clientWidth*r)),u=Math.max(1,Math.round(a.clientHeight*r));t.width===i&&t.height===u||(t.width=i,t.height=u,e.viewport(0,0,i,u))}function j(t){c=null,!(!e||!s.value)&&(d||(d=t),m=(t-d)/1e3,V(),e.uniform2f(l.res,s.value.width,s.value.height),e.uniform1f(l.time,m*o.speed),e.uniform1f(l.grain,o.grain),e.uniform1f(l.glow,f.value.glow),e.uniform1f(l.vignette,f.value.vignette),e.uniform3f(l.bg,g[0],g[1],g[2]),e.uniform3fv(l.colors,M),e.drawArrays(e.TRIANGLE_STRIP,0,4),x())}function x(){c==null&&(!A.value||!R||(c=requestAnimationFrame(j)))}function w(){c!=null&&cancelAnimationFrame(c),c=null}return T(f,()=>{S="",e&&x()}),W(()=>{if(o.staticFallback)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){v.value=!0;return}if(!O()){v.value=!0;return}const t=_.value;t&&(k=new IntersectionObserver(a=>{A.value=a.some(r=>r.isIntersecting),A.value?(d=performance.now()-m*1e3,x()):w()},{threshold:.02}),k.observe(t),L=new ResizeObserver(()=>p()),L.observe(t),h=()=>{R=document.visibilityState!=="hidden",R?(d=performance.now()-m*1e3,x()):w()},document.addEventListener("visibilitychange",h),window.addEventListener("resize",p))}),Y(()=>{w(),k?.disconnect(),L?.disconnect(),h&&document.removeEventListener("visibilitychange",h),window.removeEventListener("resize",p),e&&n&&e.deleteProgram(n),e=null,n=null}),T(()=>o.staticFallback,t=>{t&&(w(),v.value=!0)}),(t,a)=>(U(),z("div",{ref_key:"containerRef",ref:_,style:B({height:b.height}),class:X(J(Q)("relative w-full overflow-hidden",o.class)),"data-velaris":v.value?"static":"live"},[v.value||b.staticFallback?(U(),z("div",{key:0,class:"absolute inset-0 animate-[drift_28s_ease-in-out_infinite]",style:B(D.value),"aria-hidden":"true"},null,4)):(U(),z("canvas",{key:1,ref_key:"canvasRef",ref:s,class:"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":"true"},null,512)),Z("div",re,[ee(t.$slots,"default")])],14,te))}});export{ie as S,le as _};
