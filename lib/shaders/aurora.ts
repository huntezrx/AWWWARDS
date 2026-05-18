import { GLSL_NOISE, GLSL_ROTATE } from "./noise";

export const auroraVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main(){
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const auroraFragment = /* glsl */ `
  ${GLSL_NOISE}
  ${GLSL_ROTATE}

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  uniform float uScroll;
  varying vec2 vUv;

  // Aurora colour palette
  vec3 palette(float t){
    vec3 a = vec3(0.05, 0.02, 0.12);
    vec3 b = vec3(0.10, 0.10, 0.20);
    vec3 c = vec3(0.38, 0.22, 0.60);
    vec3 d = vec3(0.00, 0.30, 0.80);
    // indigo → violet → cyan
    vec3 col1 = a + b * cos(6.28318*(c*t+d));
    // pink accent band
    vec3 e = vec3(0.60, 0.08, 0.30);
    vec3 f = vec3(0.20, 0.20, 0.20);
    vec3 g = vec3(0.50, 0.40, 0.30);
    vec3 h = vec3(0.00, 0.20, 0.60);
    vec3 col2 = e + f * cos(6.28318*(g*t+h));
    return mix(col1, col2, smoothstep(0.4, 0.6, t));
  }

  void main(){
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;

    // Scroll-driven pan
    uv.y += uScroll * 0.08;

    // Mouse distortion field
    vec2 toMouse = uv - mouse;
    float mouseDist = length(toMouse);
    float mouseWarp = exp(-mouseDist * 3.5) * 0.12;
    uv += normalize(toMouse + 0.001) * mouseWarp * sin(uTime * 2.0);

    // Primary noise layer
    vec3 p = vec3(uv * 2.5, uTime * 0.18);
    float n1 = fbm(p, 5);
    float n2 = fbm(p + vec3(n1 * 1.2, 0.0, uTime * 0.07), 4);
    float n3 = fbm(p + vec3(n2 * 0.8, n1 * 0.6, 0.0), 3);

    // Aurora bands — horizontal streaks with vertical sway
    float aurora = 0.0;
    for(int i = 0; i < 4; i++){
      float fi = float(i);
      float bandY = 0.2 + fi * 0.18 + n1 * 0.12 + sin(uTime * 0.3 + fi * 1.3) * 0.06;
      float band = exp(-abs(uv.y - bandY) * 8.0);
      // wavy horizontal flow
      float wave = sin(uv.x * 4.0 + uTime * (0.4 + fi * 0.15) + n2 * 3.0) * 0.5 + 0.5;
      aurora += band * wave * (0.6 + 0.4 * sin(uTime * 0.5 + fi));
    }
    aurora = clamp(aurora, 0.0, 1.2);

    // Colour mapping
    float colT = n3 * 0.4 + uv.x * 0.3 + uTime * 0.04;
    vec3 col = palette(fract(colT));
    col *= aurora;

    // Depth fog toward edges
    float vignette = 1.0 - smoothstep(0.3, 1.0, length((vUv - 0.5) * vec2(1.6, 1.2)));
    col *= vignette;

    // Background deep space tone
    vec3 bg = vec3(0.005, 0.005, 0.018) + vec3(0.01, 0.005, 0.03) * n1;
    col = bg + col;

    // Subtle star field from high-freq noise
    float stars = pow(max(0.0, snoise(vec3(uv * 180.0, 1.0))), 20.0) * 0.6;
    col += vec3(stars) * vec3(0.8, 0.85, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;
