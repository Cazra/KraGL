precision mediump float;

uniform vec2 p;
uniform vec2 u;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

const int GRAD_LINEAR = 1;
const int GRAD_RADIAL = 2;
uniform int gradientType;

// The array of colors for each break point in the gradient.
uniform vec4 colors[16]; 

// The parametric break points for the gradient, including the start and 
// end break points (0 and 1). 
// The values in this array must be in ascending order.
uniform int breakPtCount;
uniform float breakPts[16]; 

varying vec2 texCoords;
varying vec3 vNormal;

/** 
 * This fragment shader handles both linear and radial gradients. 
 */
void main(void) {
  if(length(u) == 0.0) {
    gl_FragColor = vec4(1,1,1,1);
    return;
  }
  
  vec4 color;
  
  if(gradientType == GRAD_LINEAR) {
    vec2 v = texCoords - p;
    vec2 uHat = normalize(u);
    vec2 vHat = normalize(v);
    
    // Compute the projected parametric value for our gradient line.
    float s = (length(v)*dot(uHat, vHat))/length(u);
    
    for(int i=0; i < 15; i++) {
      if(i == 0 && s < breakPts[0]) {
        color = colors[0];
        break;
      }
      else if(i == breakPtCount - 1) {
        color = colors[i];
        break;
      }
      else if(s >= breakPts[i] && s < breakPts[i + 1]) {
        vec4 c1 = colors[i];
        vec4 c2 = colors[i+1];
        
        float ds = breakPts[i+1] - breakPts[i];
        float alpha = (s-breakPts[i])/ds;
        
        color = colors[i]*(1.0-alpha) + colors[i+1]*alpha;
        break;
      }
    }
  }
  else if(gradientType == GRAD_RADIAL) {
    float radU = length(u);
    
    vec2 v = texCoords - p;
    float radV = length(v);
    
    // Compute the projected parametric value for our gradient line.
    float s = sqrt((radV*radV)/(radU*radU));
    
    for(int i=0; i < 16; i++) {
      if(i == 0 && s < breakPts[0]) {
        color = colors[0];
        break;
      }
      else if(i == breakPtCount - 1) {
        color = colors[i];
        break;
      }
      else if(s >= breakPts[i] && s < breakPts[i + 1]) {
        vec4 c1 = colors[i];
        vec4 c2 = colors[i+1];
        
        float ds = breakPts[i+1] - breakPts[i];
        float alpha = (s-breakPts[i])/ds;
        
        color = colors[i]*(1.0-alpha) + colors[i+1]*alpha;
        break;
      }
    }
  }
  else {
    color = vec4(1,1,1,1);
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
  
  gl_FragColor = color;
}