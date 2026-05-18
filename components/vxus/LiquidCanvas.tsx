"use client";

import { useEffect, useRef } from "react";

/* Performance-optimized liquid metal shader
   - Runs at 50% resolution, scaled via CSS
   - Domain-warped FBM → dark iridescent violet-cyan
   - Pauses when document is hidden
   - Mobile fallback: CSS gradient */

const VERT = `
  attribute vec2 a;
  varying   vec2 v;
  void main(){ v=a*.5+.5; gl_Position=vec4(a,0,1); }
`;

const FRAG = `
  precision mediump float;
  uniform float t;
  varying vec2  v;

  vec2 h2(vec2 p){
    p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
    return -1.+2.*fract(sin(p)*43758.5453);
  }
  float gn(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
    return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1,0)),f-vec2(1,0)),u.x),
               mix(dot(h2(i+vec2(0,1)),f-vec2(0,1)),dot(h2(i+vec2(1)),f-vec2(1)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.,a=.5;
    for(int i=0;i<5;i++){v+=a*gn(p);p=p*2.1+vec2(3.7,8.1);a*=.5;}
    return v;
  }
  void main(){
    vec2 uv=v;
    float s=t*.1;
    vec2 q=vec2(fbm(uv*2.+s),fbm(uv*2.+vec2(5.2,1.3)));
    vec2 r=vec2(fbm(uv*1.5+4.*q+vec2(1.7,9.2)+s*.7),
                fbm(uv*1.5+4.*q+vec2(8.3,2.8)+s*.6));
    float n=fbm(uv+4.*r)*.5+.5;

    vec3 c1=vec3(.011,.007,.05);
    vec3 c2=vec3(.048,.018,.21);
    vec3 c3=vec3(.012,.06,.28);
    vec3 c4=vec3(.0,.04,.12);

    vec3 c=mix(c1,c2,smoothstep(.15,.4,n));
    c=mix(c,c3,smoothstep(.4,.65,n));
    c=mix(c,c4,smoothstep(.65,.85,n)*.55);
    c+=vec3(.06,.02,.2)*pow(n,2.5);
    c+=vec3(0.,.05,.12)*(1.-n)*.35;

    vec2 d=uv-.5;
    c*=.35+.7*smoothstep(.72,.0,length(d));
    gl_FragColor=vec4(c,1.);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function LiquidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const tLoc = gl.getUniformLocation(prog, "t");

    let raf = 0;
    let startTime = Date.now();
    let frame = 0;

    const resize = () => {
      /* Run at 50% resolution for performance */
      canvas.width  = Math.floor(window.innerWidth  * 0.5);
      canvas.height = Math.floor(window.innerHeight * 0.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = () => {
      if (document.hidden) { raf = requestAnimationFrame(render); return; }
      frame++;
      /* Skip every other frame on low-end devices (~30fps) */
      if (frame % 2 === 0) { raf = requestAnimationFrame(render); return; }
      const t = (Date.now() - startTime) / 1000;
      gl.uniform1f(tLoc, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: "auto" }}
      aria-hidden
    />
  );
}
