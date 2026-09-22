import{d as H,a8 as j,v as q,e as T,r as b,w as B,o as K,b as W,i as k,n as Y,J as M,l as J,m as X,h as Q,a7 as Z,q as z}from"./index-C8njg5La.js";const ee=["data-velaris"],te={class:"relative z-10 h-full w-full"},ne=`
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
`,ae=H({__name:"Velaris",props:{bg:{default:"#000000"},colors:{default:()=>["#86efac","#4ade80","#059669","#000000"]},speed:{default:2},grain:{default:.3},height:{default:"100vh"},class:{default:void 0},glow:{default:.3},vignette:{default:.8},staticFallback:{type:Boolean,default:!1},themed:{type:Boolean,default:!0}},setup(y){const r=y,{isDark:I}=j(q()),N=t=>Array.isArray(t)&&typeof t[0]=="string",$=t=>Array.isArray(t)&&Array.isArray(t[0]),F=t=>Array.isArray(t),f=T(()=>{const t=r.themed&&I.value?1:0;return{bg:N(r.bg)?r.bg[t]:r.bg,colors:$(r.colors)?r.colors[t]:r.colors,glow:F(r.glow)?r.glow[t]:r.glow,vignette:F(r.vignette)?r.vignette[t]:r.vignette}}),_=b(null),s=b(null),A=b(!1),v=b(!1);let m=[0,0,0],P=new Float32Array(12),S="";function E(t){const o=t.replace("#","").trim(),n=o.length===3?o.split("").map(i=>i+i).join(""):o.padEnd(6,"0");return[Number.parseInt(n.slice(0,2),16)/255,Number.parseInt(n.slice(2,4),16)/255,Number.parseInt(n.slice(4,6),16)/255]}function V(){const{bg:t,colors:o}=f.value,n=`${t}|${o.join(",")}`;if(n===S)return;S=n,m=E(t);const i=o.slice(0,4);for(;i.length<4;)i.push(i.at(-1)??"#000000");P=new Float32Array(i.flatMap(E))}const D=T(()=>{const{bg:t,colors:o,glow:n}=f.value,i=Math.round(Math.min(.9,.35+n)*100);return{background:`radial-gradient(75% 70% at 38% 42%, ${o[1]} 0%, transparent ${i}%),
      radial-gradient(120% 110% at 22% 12%, ${o[0]} 0%, transparent 55%),
      radial-gradient(130% 120% at 50% 108%, ${o[2]} 0%, transparent 58%),
      ${t}`}});let e=null,a=null,c=null,R=null,L=null,U=!0,d=0,g=0,h=null;const l={res:null,time:null,grain:null,glow:null,vignette:null,colors:null,bg:null};function C(t,o){if(!e)return null;const n=e.createShader(t);return n?(e.shaderSource(n,o),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)?n:(e.deleteShader(n),null)):null}function O(){const t=s.value;if(!t||(e=t.getContext("webgl",{antialias:!1,alpha:!1,depth:!1})??t.getContext("experimental-webgl"),!e))return!1;const o=C(e.VERTEX_SHADER,ne),n=C(e.FRAGMENT_SHADER,oe);if(!o||!n||(a=e.createProgram(),!a)||(e.attachShader(a,o),e.attachShader(a,n),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS)))return!1;e.useProgram(a);const i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const u=e.getAttribLocation(a,"position");return e.enableVertexAttribArray(u),e.vertexAttribPointer(u,2,e.FLOAT,!1,0,0),l.res=e.getUniformLocation(a,"u_resolution"),l.time=e.getUniformLocation(a,"u_time"),l.grain=e.getUniformLocation(a,"u_grain"),l.glow=e.getUniformLocation(a,"u_glow"),l.vignette=e.getUniformLocation(a,"u_vignette"),l.colors=e.getUniformLocation(a,"u_colors"),l.bg=e.getUniformLocation(a,"u_bg"),p(),!0}function p(){const t=s.value,o=_.value;if(!t||!o||!e)return;const n=Math.min(window.devicePixelRatio||1,2),i=Math.max(1,Math.round(o.clientWidth*n)),u=Math.max(1,Math.round(o.clientHeight*n));t.width===i&&t.height===u||(t.width=i,t.height=u,e.viewport(0,0,i,u))}function G(t){c=null,!(!e||!s.value)&&(d||(d=t),g=(t-d)/1e3,V(),e.uniform2f(l.res,s.value.width,s.value.height),e.uniform1f(l.time,g*r.speed),e.uniform1f(l.grain,r.grain),e.uniform1f(l.glow,f.value.glow),e.uniform1f(l.vignette,f.value.vignette),e.uniform3f(l.bg,m[0],m[1],m[2]),e.uniform3fv(l.colors,P),e.drawArrays(e.TRIANGLE_STRIP,0,4),x())}function x(){c==null&&(!A.value||!U||(c=requestAnimationFrame(G)))}function w(){c!=null&&cancelAnimationFrame(c),c=null}return B(f,()=>{S="",e&&x()}),K(()=>{if(r.staticFallback)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){v.value=!0;return}if(!O()){v.value=!0;return}const t=_.value;t&&(R=new IntersectionObserver(o=>{A.value=o.some(n=>n.isIntersecting),A.value?(d=performance.now()-g*1e3,x()):w()},{threshold:.02}),R.observe(t),L=new ResizeObserver(()=>p()),L.observe(t),h=()=>{U=document.visibilityState!=="hidden",U?(d=performance.now()-g*1e3,x()):w()},document.addEventListener("visibilitychange",h),window.addEventListener("resize",p))}),W(()=>{w(),R?.disconnect(),L?.disconnect(),h&&document.removeEventListener("visibilitychange",h),window.removeEventListener("resize",p),e&&a&&e.deleteProgram(a),e=null,a=null}),B(()=>r.staticFallback,t=>{t&&(w(),v.value=!0)}),(t,o)=>(z(),k("div",{ref_key:"containerRef",ref:_,style:M({height:y.height}),class:Y(J(X)("relative w-full overflow-hidden",r.class)),"data-velaris":v.value?"static":"live"},[v.value||y.staticFallback?(z(),k("div",{key:0,class:"absolute inset-0 animate-[drift_28s_ease-in-out_infinite]",style:M(D.value),"aria-hidden":"true"},null,4)):(z(),k("canvas",{key:1,ref_key:"canvasRef",ref:s,class:"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":"true"},null,512)),Q("div",te,[Z(t.$slots,"default")])],14,ee))}});export{ae as _};
