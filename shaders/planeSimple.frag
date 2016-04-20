precision mediump float;

uniform float opacity;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

uniform vec4 sFunc;
uniform vec4 tFunc;

varying vec3 vNormal;

// It is impossible to keep texture coordinates for an infinite plane. 
// Therefore, we will compute the texture coordinates as a function of our world coordinates.
varying vec3 worldCoords;

void main(void) {
  vec4 color;
  
  float s = fract(worldCoords.x*sFunc.x + worldCoords.y*sFunc.y + worldCoords.z*sFunc.z + sFunc.w);
  float t = fract(worldCoords.x*tFunc.x + worldCoords.y*tFunc.y + worldCoords.z*tFunc.z + tFunc.w);
  
  if(useTex) {
    color = texture2D(tex, vec2(s, t)); 
  }
  else {
    color = solidColor;
  }
  
  float alpha = color.a * opacity;
  
  if(alpha == 0.0) {
    discard;
  }
  
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
  
  gl_FragColor = vec4(color.rgb, alpha);
}