precision mediump float;
precision highp int;

uniform float opacity;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

// Color, texture
uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

// Interpolated vertex attributes
varying vec2 texCoords;
varying vec4 iDiff;
varying vec4 iSpec;

void main(void) {
  // Get base color from texture.
  vec4 texColor;
  if(useTex) {
    texColor = texture2D(tex, texCoords);
  }
  else {
    texColor = solidColor;
  }
  float texAlpha = texColor.a * opacity;
  if(texAlpha == 0.0) {
    discard;
  }
  
  vec4 color = texColor*(iDiff) + iSpec;
  
  // Use distance from eye to compute fog blending.
  if(fogEquation != FOG_NONE) {
    float depth = gl_FragCoord.z/gl_FragCoord.w;
    
    float fogFactor;
    if(fogEquation == FOG_LINEAR) {
      fogFactor = depth*fogDensity/1000.0;
      
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      color = mix(color, fogColor, fogFactor);
    }
    else if(fogEquation == FOG_EXP) {
      fogFactor = exp(-(fogDensity*depth));
      
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      color = mix(fogColor, color, fogFactor);
    }
    else if(fogEquation == FOG_EXP2) {
      fogFactor = exp(-pow((fogDensity*depth), 2.0));
      
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      color = mix(fogColor, color, fogFactor);
    }
  }
  
  gl_FragColor = vec4(color.rgb, texAlpha);
}



