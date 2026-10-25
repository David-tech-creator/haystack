/**
 * Haystack shaders. One Points cloud; every formation is a per-particle
 * target attribute and the vertex shader folds them together in chain order
 * with per-stage 0..1 uniforms. Nothing moves on the CPU per frame.
 *
 * The page is cream, so this is ink on paper: normal blending with
 * premultiplied alpha, navy ink (paper ink over the dark section) and a gold
 * accent. w of every target is packed as b + 3 * gold + 6 * special.
 */

export const FORMATION_COUNT = 7

export const vertexShader = /* glsl */ `
attribute vec4 aRand;   // x phase, y delay, z size seed, w gold fleck
attribute vec4 aF0;     // haystack
attribute vec4 aF1;     // sweep
attribute vec4 aF2;     // needle
attribute vec4 aF3;     // thread
attribute vec4 aF4;     // stitch
attribute vec4 aF5;     // loose
attribute vec4 aF6;     // contact

uniform float uTime;
uniform float uSize;
uniform float uTurb;
uniform float uIntro;
uniform float uM[7];
uniform vec3 uOff[7];
uniform vec3 uScl[7];
uniform vec2 uPointer;
uniform float uPointerOn;
uniform float uGlowR;
uniform float uStackR;
uniform float uSweepX;
uniform float uFlare;
uniform float uRise;
uniform float uThreadPhase;
uniform float uStitch;
uniform vec2 uLead;
uniform float uLeadAng;
uniform float uLeadOn;
uniform float uLeadLen;
uniform float uKnot;

varying float vB;
varying float vG;

vec3 P;
float B;
float G;   // gold share
float F;   // how settled into a shape (0 = loose field)
float T;   // how much in transit

vec3 rotY(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
vec3 rotX(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
vec2 rot2(vec2 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

void dec(float w, out float b, out float g, out float s) {
  s = floor(w / 6.0);
  float r = w - s * 6.0;
  g = floor(r / 3.0);
  b = r - g * 3.0;
}

// straws sway from the base, more at the top
float sway(vec3 h) {
  return sin(uTime * 0.7 + h.x * 7.0 + aRand.x * 0.4) * 0.006 * (h.y + uStackR) / (2.0 * uStackR);
}

// Staggered arrival: each particle has its own delay and swings in around
// the vertical axis until it lands.
void morph(vec3 tgt, float tb, float tg, float m, vec3 off, vec3 scl) {
  if (m <= 0.0) return;
  float l = clamp(m * 1.4 - aRand.y * 0.4, 0.0, 1.0);
  l = l * l * (3.0 - 2.0 * l);
  vec3 t = rotY(tgt * scl, (1.0 - l) * (0.8 + aRand.x * 0.6)) + off;
  P = mix(P, t, l);
  B = mix(B, tb, l);
  G = mix(G, tg, l);
  F = mix(F, 1.0, l);
  T = max(T * (1.0 - l), l * (1.0 - l) * 4.0);
}

void main() {
  P = position;
  B = 0.12 + 0.16 * aRand.z * aRand.z;
  B *= 0.75 + 0.25 * sin(uTime * (0.5 + aRand.x * 1.4) + aRand.x * 40.0);
  G = 0.0;
  F = 0.0;
  T = 0.0;
  float b; float g; float s;

  // 1. haystack
  if (uM[0] > 0.0) {
    dec(aF0.w, b, g, s);
    vec3 h = aF0.xyz;
    if (b > 0.5) h.x += sway(h);
    morph(h, b, g, uM[0], uOff[0], uScl[0]);
  }

  // 2. sweep: a search line slides across, passed straws dim, the gold one flares
  if (uM[1] > 0.0) {
    dec(aF1.w, b, g, s);
    vec3 h = aF1.xyz;
    if (s > 0.5) {
      h.x += uSweepX;
    } else {
      if (b > 0.5) h.x += sway(h);
      if (g < 0.5 && b > 0.5 && h.x < uSweepX - 0.02) b *= 0.55;
      if (g > 0.5) b += uFlare * 0.45;
    }
    morph(h, b, g, uM[1], uOff[1], uScl[1]);
  }

  // 3. needle rises out of the pile and turns a few degrees
  if (uM[2] > 0.0) {
    dec(aF2.w, b, g, s);
    vec3 n = aF2.xyz;
    if (s > 0.5) {
      n.xy = rot2(n.xy - vec2(0.0, 0.1), sin(uTime * 0.45) * 0.025 + (1.0 - uRise) * 0.18) + vec2(0.0, 0.1);
      n.y += (uRise - 1.0) * 0.5;
    } else if (b > 0.3) {
      n.y += sin(uTime * 0.6 + n.x * 3.0) * 0.004;
    }
    morph(n, b, g, uM[2], uOff[2], uScl[2]);
  }

  // 4. thread: running stitch, the dashes travel with scroll
  if (uM[3] > 0.0) {
    dec(aF3.w, b, g, s);
    vec3 t = aF3.xyz;
    if (s > 0.5 && s < 1.5) {
      float d = fract(t.x * 11.0 - uThreadPhase);
      b *= smoothstep(0.0, 0.04, d) * (1.0 - smoothstep(0.54, 0.58, d));
    }
    morph(t, b, g, uM[3], uOff[3], uScl[3]);
  }

  // 5. stitch: outlines drawn card by card, the needle point leading
  if (uM[4] > 0.0) {
    dec(aF4.w, b, g, s);
    vec3 c = aF4.xyz;
    if (s > 1.5) {
      vec2 l = c.xy;
      l.x -= uLeadLen * 0.5;
      c = vec3(uLead + rot2(l, uLeadAng), 0.0);
      b *= uLeadOn;
    } else if (s > 0.5) {
      float k = c.z;
      c.z = 0.0;
      b *= 1.0 - smoothstep(uStitch - 0.006, uStitch, k);
    }
    morph(c, b, g, uM[4], uOff[4], uScl[4]);
  }

  // 6. loose ball of thread, turning very slowly
  if (uM[5] > 0.0) {
    dec(aF5.w, b, g, s);
    vec3 l = aF5.xyz;
    if (s > 0.5) l = rotX(rotY(l, uTime * 0.08), 0.35);
    morph(l, b, g, uM[5], uOff[5], uScl[5]);
  }

  // 7. contact: stitched outline, the knot pulses once
  if (uM[6] > 0.0) {
    dec(aF6.w, b, g, s);
    if (s > 0.5) b *= 1.0 + uKnot * 1.1;
    morph(aF6.xyz, b, g, uM[6], uOff[6], uScl[6]);
  }

  // first paint: loose straw falls in from above the viewport
  float il = clamp(uIntro * 1.6 - aRand.y * 0.6, 0.0, 1.0);
  il = il * il * (3.0 - 2.0 * il);
  P.y += (1.0 - il) * (2.4 + aRand.x * 1.4);
  P.x += (1.0 - il) * sin(aRand.x * 31.0 + uTime * 0.7) * 0.22;
  T = max(T, il * (1.0 - il) * 2.0);

  // drift: cross-coupled sine field, looser in the open field and in transit,
  // roughened by scroll speed
  vec3 q = P * 2.3 + aRand.x * 9.0;
  vec3 drift = vec3(
    sin(q.y + uTime * 0.31) + sin(q.z * 1.3 - uTime * 0.17),
    sin(q.z + uTime * 0.27) + sin(q.x * 1.1 + uTime * 0.23),
    sin(q.x + uTime * 0.19) + sin(q.y * 0.9 - uTime * 0.29)
  );
  float amp = 0.0012 + (1.0 - F) * 0.02 + T * 0.03 + uTurb * (0.01 + 0.045 * aRand.x);
  P += drift * amp;

  // pointer: particles step aside in a soft radius, then spring back
  vec2 dp = P.xy - uPointer;
  float dist = length(dp);
  float fall = 1.0 - smoothstep(0.0, uGlowR, dist);
  P.xy += (dp / max(dist, 1e-4)) * fall * fall * 0.06 * uPointerOn;
  float glow = fall * uPointerOn;
  B += glow * 0.35 * F;

  vec4 mv = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mv;
  float depthFade = smoothstep(-6.0, -1.2, mv.z);
  gl_PointSize = uSize * aRand.z * (0.7 + 0.42 * min(B, 1.5)) * (1.0 + glow * 0.4) / -mv.z;
  vB = clamp(B, 0.0, 2.0) * mix(0.35, 1.0, depthFade);
  vG = max(G, aRand.w * (1.0 - F) * 0.9);
}
`

export const fragmentShader = /* glsl */ `
uniform vec3 uInkA;
uniform vec3 uInkB;
uniform vec3 uGoldA;
uniform vec3 uGoldB;
uniform float uInk;
uniform float uOpacity;
varying float vB;
varying float vG;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c) * 4.0;
  if (d > 1.0) discard;
  float a = 1.0 - d;
  a = a * (0.55 + 0.45 * a);
  vec3 ink = mix(uInkA, uInkB, uInk);
  vec3 gold = mix(uGoldA, uGoldB, uInk);
  vec3 col = mix(ink, gold, clamp(vG, 0.0, 1.0));
  float alpha = min(1.0, a * min(vB, 1.4) * uOpacity);
  gl_FragColor = vec4(col * alpha, alpha);
}
`
