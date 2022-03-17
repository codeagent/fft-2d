export const vs = `#version 300 es
in vec4 position;
void main() {
  gl_Position = position;
}
`;

export const fs = `#version 300 es
precision highp float;

layout(location = 0) out vec4 ifft0;
layout(location = 1) out vec4 ifft1;

uniform sampler2D spectrum0;
uniform sampler2D spectrum1;
uniform sampler2D butterfly;
uniform uint phase;

struct complex {
  float re;
  float im;
};

complex add(complex a, complex b) {
  return complex(a.re + b.re, a.im + b.im);
}

complex mult(complex a, complex b) {
  return complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}

complex scale(complex a, float v) {
  return complex(a.re * v, a.im * v);
}

vec2 twiddleXY(in sampler2D source, in vec4 texelButt) {
  vec4 texelA = texelFetch(source, ivec2(texelButt.b, gl_FragCoord.y), 0).xyzw;
  vec4 texelB = texelFetch(source, ivec2(texelButt.a, gl_FragCoord.y), 0).xyzw;
  complex a = complex(texelA.x, texelA.y);
  complex b = complex(texelB.x, texelB.y);
  complex w = complex(texelButt.r, texelButt.g);
  complex r = scale(add(a, mult(b, w)), 0.5);

  return vec2(r.re, r.im);
}

vec2 twiddleZW(in sampler2D source, in vec4 texelButt) {
  vec4 texelA = texelFetch(source, ivec2(texelButt.b, gl_FragCoord.y), 0).xyzw;
  vec4 texelB = texelFetch(source, ivec2(texelButt.a, gl_FragCoord.y), 0).xyzw;
  complex a = complex(texelA.z, texelA.w);
  complex b = complex(texelB.z, texelB.w);
  complex w = complex(texelButt.r, texelButt.g);
  complex r = scale(add(a, mult(b, w)), 0.5);

  return vec2(r.re, r.im);
}

void main() {
  vec4 texelButt = texelFetch(butterfly, ivec2(phase,  gl_FragCoord.x), 0).rgba;
  ifft0 = vec4(twiddleXY(spectrum0, texelButt), twiddleZW(spectrum0, texelButt));
  ifft1 = vec4(twiddleXY(spectrum1, texelButt), twiddleZW(spectrum1, texelButt));
}
`;
