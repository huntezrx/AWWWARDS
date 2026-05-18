import { GLSL_NOISE } from "./noise";

// GPU particle system — vertex drives position via noise field
export const particleVertex = /* glsl */ `
  ${GLSL_NOISE}

  attribute float aIndex;
  attribute vec3  aBasePosition;
  attribute float aSize;
  attribute vec3  aColor;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScroll;

  varying vec3  vColor;
  varying float vAlpha;

  void main(){
    float fi = aIndex;

    // Noise-driven displacement
    float t = uTime * 0.25 + fi * 0.01;
    vec3 np = aBasePosition * 2.5 + vec3(t);
    float nx = snoise(np);
    float ny = snoise(np + vec3(31.4, 0.0, 0.0));
    float nz = snoise(np + vec3(0.0, 17.3, 0.0));

    vec3 pos = aBasePosition + vec3(nx, ny, nz) * 0.6;

    // Scroll parallax per depth layer
    float layer = mod(fi, 3.0) / 3.0;
    pos.y -= uScroll * (0.2 + layer * 0.5);

    // Mouse attraction (gentle)
    vec2 mouse = uMouse * 0.5;
    vec2 toMouse = mouse - pos.xy;
    float md = length(toMouse);
    pos.xy += toMouse * (0.04 / (md * md + 0.5));

    // Flicker
    float flicker = sin(uTime * 3.0 + fi * 73.1) * 0.5 + 0.5;
    vAlpha = (0.3 + flicker * 0.5) * smoothstep(8.0, 2.0, length(pos));

    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z) * (0.7 + flicker * 0.3);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main(){
    // Circular soft point
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if(d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Mouse trail — renders a fading smear of points
export const trailVertex = /* glsl */ `
  attribute float aT;   // 0 = newest, 1 = oldest
  uniform float uTime;
  varying float vT;
  void main(){
    vT = aT;
    gl_PointSize = mix(12.0, 1.0, aT);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const trailFragment = /* glsl */ `
  varying float vT;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if(d > 0.5) discard;
    float alpha = (1.0 - vT) * smoothstep(0.5, 0.1, d) * 0.7;
    vec3 col = mix(vec3(0.38, 0.22, 0.85), vec3(0.05, 0.55, 0.80), vT);
    gl_FragColor = vec4(col, alpha);
  }
`;
