precision mediump float;

uniform sampler2D tex;
uniform bool useTex;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

varying vec2 texCoords;
varying vec3 vNormal;

// All fragments are colored white.
void main(void) {
  vec4 tColor;
  if(useTex) {
    tColor = texture2D(tex, texCoords); // Just so we don't crash when we try to give the shader a texture. 
  }
  else {
    tColor = vec4(1,1,1,1);
  }
  
  if(tColor.a == 0.0) {
    discard;
  }
  else {
    vec4 color = vec4((vNormal[0]+1.0)/2.0, (vNormal[1]+1.0)/2.0, (vNormal[2]+1.0)/2.0, 1.0);
    
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
  
    gl_FragColor = vec4(color.rgb, 1.0);
  }
}