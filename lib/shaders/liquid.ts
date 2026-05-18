import { GLSL_NOISE } from "./noise";

// Full-screen liquid distortion pass
export const liquidVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const liquidFragment = /* glsl */ `
  ${GLSL_NOISE}

  uniform float uTime;
  uniform vec2  uMouse;
  uniform sampler2D uTexture;
  varying vec2  vUv;

  void main(){
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;

    // Noise-based UV distortion
    float n = snoise(vec3(uv * 3.0, uTime * 0.4)) * 0.015;
    float n2= snoise(vec3(uv * 6.0 + 1.3, uTime * 0.3)) * 0.008;
    uv += n + n2;

    // Mouse ripple
    vec2 d = uv - mouse;
    float dist = length(d);
    float ripple = sin(dist * 40.0 - uTime * 5.0) * exp(-dist * 6.0) * 0.018;
    uv += normalize(d + 0.001) * ripple;

    gl_FragColor = texture2D(uTexture, uv);
  }
`;

// Per-mesh glass / refraction shader
export const glassVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main(){
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const glassFragment = /* glsl */ `
  ${GLSL_NOISE}

  uniform float uTime;
  uniform vec2  uMouse;
  uniform samplerCube uEnv;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vViewPosition;

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // Surface noise bump
    float bump = snoise(vec3(vUv * 8.0, uTime * 0.3)) * 0.08;
    vec3 pertN = normalize(N + vec3(bump, bump * 0.5, 0.0));

    // Fresnel
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    // Reflection
    vec3 R = reflect(-V, pertN);
    vec4 envCol = textureCube(uEnv, R);

    // Refraction
    vec3 Rf = refract(-V, pertN, 0.67);
    vec4 refCol = textureCube(uEnv, Rf);

    vec3 col = mix(refCol.rgb, envCol.rgb, fresnel);

    // Iridescent tint
    float iri = sin(fresnel * 12.0 + uTime) * 0.5 + 0.5;
    col += vec3(0.1, 0.05, 0.2) * iri * 0.3;

    gl_FragColor = vec4(col, 0.75 + fresnel * 0.25);
  }
`;

// Gooey / blob distortion for UI cards
export const gooeyFragment = /* glsl */ `
  ${GLSL_NOISE}

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  varying vec2  vUv;

  float sdSphere(vec3 p, float r){ return length(p) - r; }

  void main(){
    vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 mouse = (uMouse * 0.5 + 0.5 - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    // Multiple metaballs
    float field = 0.0;
    for(int i = 0; i < 5; i++){
      float fi = float(i);
      vec2 pos = vec2(
        sin(uTime * (0.3 + fi * 0.13) + fi * 2.1) * 0.35,
        cos(uTime * (0.2 + fi * 0.11) + fi * 1.7) * 0.25
      );
      float r = 0.12 + sin(uTime * 0.5 + fi) * 0.04;
      field += r / length(uv - pos);
    }

    // Mouse blob
    field += 0.08 / (length(uv - mouse) + 0.001);

    float blob = smoothstep(0.95, 1.05, field);

    // Colour
    float n = snoise(vec3(uv * 3.0, uTime * 0.2));
    vec3 col1 = vec3(0.24, 0.22, 0.85); // indigo
    vec3 col2 = vec3(0.05, 0.55, 0.80); // cyan
    vec3 col3 = vec3(0.55, 0.10, 0.75); // violet
    float t = n * 0.5 + 0.5 + uTime * 0.05;
    vec3 blobCol = mix(col1, mix(col2, col3, sin(t) * 0.5 + 0.5), cos(t * 1.3) * 0.5 + 0.5);

    // Edge glow
    float glow = smoothstep(0.7, 1.0, field) * (1.0 - blob) * 0.5;
    vec3 finalCol = blobCol * blob + blobCol * glow;
    float alpha = blob * 0.85 + glow * 0.4;

    gl_FragColor = vec4(finalCol, alpha);
  }
`;
