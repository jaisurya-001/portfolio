export const planetVertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vNormal;
  void main() {
    vObj = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const planetFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uLightDir;
  uniform float uBands;
  uniform float uSeed;
  uniform float uTime;
  uniform float uNoiseAmt;
  varying vec3 vObj;
  varying vec3 vNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(uSeed, uSeed * 0.37, 0.17));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 nrm = normalize(vObj);
    float nse = noise(nrm * uNoiseAmt + vec3(uSeed, uTime * 0.02, 0.0));
    float band = sin((nrm.y + (nse - 0.5) * 0.22) * uBands);
    float mixAmt = clamp(0.5 + band * 0.38 + (nse - 0.5) * 0.55, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, mixAmt);
    float shade = dot(normalize(vNormal), normalize(uLightDir));
    col *= 0.2 + 0.8 * clamp(shade, 0.0, 1.0);
    float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.4);
    col += fres * 0.16;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export const sunVertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vNormal;
  void main() {
    vObj = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const sunFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vObj;
  varying vec3 vNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.23, 0.07));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 nrm = normalize(vObj);
    float n1 = noise(nrm * 2.5 + vec3(uTime * 0.045, 0.0, uTime * 0.02));
    float n2 = noise(nrm * 7.0 - uTime * 0.08);
    vec3 hot = vec3(1.0, 0.93, 0.75);
    vec3 amber = vec3(1.0, 0.62, 0.18);
    vec3 deep = vec3(0.85, 0.28, 0.05);
    vec3 col = mix(deep, amber, n1);
    col = mix(col, hot, smoothstep(0.55, 0.9, n1) * 0.65);
    col += n2 * 0.08;
    float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    col += rim * vec3(1.0, 0.7, 0.3) * 0.25;
    gl_FragColor = vec4(col, 1.0);
  }
`

export const ringVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const ringFragment = /* glsl */ `
  varying vec3 vPos;
  uniform vec3 uColor;
  void main() {
    float r = length(vPos.xy);
    float lanes = 0.35 + 0.65 * smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(r * 46.0));
    float fade = smoothstep(1.15, 1.35, r) * (1.0 - smoothstep(2.15, 2.35, r));
    float alpha = lanes * 0.78 * fade;
    gl_FragColor = vec4(uColor, alpha);
    if (alpha < 0.02) discard;
  }
`

export const nebulaVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vWorld = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const nebulaFragment = /* glsl */ `
  varying vec3 vWorld;
  uniform float uTime;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.43, 0.17, 0.89));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 p = normalize(vWorld);
    float t = uTime * 0.02;
    float n1 = noise(p * 2.2 + vec3(t, t * 0.5, -t));
    float n2 = noise(p * 4.5 - vec3(t * 0.7, 0.0, t * 0.4));
    float cloud = smoothstep(0.42, 0.78, n1 * 0.65 + n2 * 0.35);

    vec3 violet = vec3(0.545, 0.36, 0.965);
    vec3 cyan = vec3(0.0, 0.898, 1.0);

    vec3 col = mix(violet, cyan, n2);
    float alpha = cloud * 0.18;

    gl_FragColor = vec4(col, alpha);
  }
`
