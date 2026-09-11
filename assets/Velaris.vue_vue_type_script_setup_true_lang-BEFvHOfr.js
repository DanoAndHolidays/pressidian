import{c as B,d as N,r as x,e as $,o as V,b as O,w as j,i as L,n as D,L as C,l as G,m as q,h as H,a7 as K,q as R}from"./index-BVEM3__A.js";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=B("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),W=["data-velaris"],Y={class:"relative z-10 h-full w-full"},X=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,J=`
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
`,ee=N({__name:"Velaris",props:{bg:{default:"#000000"},colors:{default:()=>["#86efac","#4ade80","#059669","#000000"]},speed:{default:2},grain:{default:.3},height:{default:"100vh"},class:{default:void 0},staticFallback:{type:Boolean,default:!1}},setup(b){const o=b,y=x(null),s=x(null),_=x(!1),f=x(!1);let d=[0,0,0],z=new Float32Array(12),F="";function E(t){const a=t.replace("#","").trim(),r=a.length===3?a.split("").map(l=>l+l).join(""):a.padEnd(6,"0");return[Number.parseInt(r.slice(0,2),16)/255,Number.parseInt(r.slice(2,4),16)/255,Number.parseInt(r.slice(4,6),16)/255]}function M(){const t=`${o.bg}|${o.colors.join(",")}`;if(t===F)return;F=t,d=E(o.bg);const a=o.colors.slice(0,4);for(;a.length<4;)a.push(a.at(-1)??"#000000");z=new Float32Array(a.flatMap(E))}const P=$(()=>({background:`radial-gradient(120% 110% at 22% 12%, ${o.colors[0]??"#f0642f"} 0%, transparent 55%),
    radial-gradient(95% 95% at 82% 28%, ${o.colors[1]??"#f0642f"} 0%, transparent 52%),
    radial-gradient(130% 120% at 50% 108%, ${o.colors[2]??"#b84924"} 0%, transparent 58%),
    ${o.bg}`}));let e=null,n=null,c=null,w=null,S=null,A=!0,v=0,m=0,h=null;const i={res:null,time:null,grain:null,colors:null,bg:null};function U(t,a){if(!e)return null;const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function T(){const t=s.value;if(!t||(e=t.getContext("webgl",{antialias:!1,alpha:!1,depth:!1})??t.getContext("experimental-webgl"),!e))return!1;const a=U(e.VERTEX_SHADER,X),r=U(e.FRAGMENT_SHADER,J);if(!a||!r||(n=e.createProgram(),!n)||(e.attachShader(n,a),e.attachShader(n,r),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS)))return!1;e.useProgram(n);const l=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,l),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const u=e.getAttribLocation(n,"position");return e.enableVertexAttribArray(u),e.vertexAttribPointer(u,2,e.FLOAT,!1,0,0),i.res=e.getUniformLocation(n,"u_resolution"),i.time=e.getUniformLocation(n,"u_time"),i.grain=e.getUniformLocation(n,"u_grain"),i.colors=e.getUniformLocation(n,"u_colors"),i.bg=e.getUniformLocation(n,"u_bg"),g(),!0}function g(){const t=s.value,a=y.value;if(!t||!a||!e)return;const r=Math.min(window.devicePixelRatio||1,2),l=Math.max(1,Math.round(a.clientWidth*r)),u=Math.max(1,Math.round(a.clientHeight*r));t.width===l&&t.height===u||(t.width=l,t.height=u,e.viewport(0,0,l,u))}function I(t){c=null,!(!e||!s.value)&&(v||(v=t),m=(t-v)/1e3,M(),e.uniform2f(i.res,s.value.width,s.value.height),e.uniform1f(i.time,m*o.speed),e.uniform1f(i.grain,o.grain),e.uniform3f(i.bg,d[0],d[1],d[2]),e.uniform3fv(i.colors,z),e.drawArrays(e.TRIANGLE_STRIP,0,4),k())}function k(){c==null&&(!_.value||!A||(c=requestAnimationFrame(I)))}function p(){c!=null&&cancelAnimationFrame(c),c=null}return V(()=>{if(o.staticFallback)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){f.value=!0;return}if(!T()){f.value=!0;return}const t=y.value;t&&(w=new IntersectionObserver(a=>{_.value=a.some(r=>r.isIntersecting),_.value?(v=performance.now()-m*1e3,k()):p()},{threshold:.02}),w.observe(t),S=new ResizeObserver(()=>g()),S.observe(t),h=()=>{A=document.visibilityState!=="hidden",A?(v=performance.now()-m*1e3,k()):p()},document.addEventListener("visibilitychange",h),window.addEventListener("resize",g))}),O(()=>{p(),w?.disconnect(),S?.disconnect(),h&&document.removeEventListener("visibilitychange",h),window.removeEventListener("resize",g),e&&n&&e.deleteProgram(n),e=null,n=null}),j(()=>o.staticFallback,t=>{t&&(p(),f.value=!0)}),(t,a)=>(R(),L("div",{ref_key:"containerRef",ref:y,style:C({height:b.height}),class:D(G(q)("relative w-full overflow-hidden bg-forest",o.class)),"data-velaris":f.value?"static":"live"},[f.value||b.staticFallback?(R(),L("div",{key:0,class:"absolute inset-0 animate-[drift_28s_ease-in-out_infinite]",style:C(P.value),"aria-hidden":"true"},null,4)):(R(),L("canvas",{key:1,ref_key:"canvasRef",ref:s,class:"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":"true"},null,512)),H("div",Y,[K(t.$slots,"default")])],14,W))}});export{Z as S,ee as _};
