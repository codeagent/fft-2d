export const vs = `#version 300 es
in vec4 position;
void main() {
  gl_Position = position;
}
`;

export const fs = `#version 300 es
precision highp float;

layout(location = 0) out vec4 displacement; 
layout(location = 1) out vec3 normals; 
layout(location = 2) out float foam; 

uniform sampler2D ifft0; // height
uniform sampler2D ifft1; // slope
uniform sampler2D ifft2; // displacement
uniform sampler2D ifft3; // ddisplacement

const float sign[] = float[2](1.0f, -1.0f);

void main() {
  float p = float(int(gl_FragCoord.x) + int(gl_FragCoord.y));
  float s = sign[int(mod(p, 2.0f))];

  float height = texelFetch(ifft0, ivec2(gl_FragCoord.xy), 0).r * s;
  vec2 slope = texelFetch(ifft1, ivec2(gl_FragCoord.xy), 0).rb * s;
  vec2 disp = texelFetch(ifft2, ivec2(gl_FragCoord.xy), 0).rb * s;
  

  displacement = vec4(disp.x, height, disp.y, 0.0f);
  normals = vec3(1.0f);
  foam = 1.0f;
}
`;
