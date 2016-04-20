precision mediump float;
precision highp int;

// Vertex attributes
attribute vec3 vertexNormal;
attribute vec3 vertexTang;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

// Transformed attributes
uniform mat4 mvpTrans;
uniform mat4 mvTrans;
uniform mat3 normalTrans;

varying vec2 texCoords;
varying vec3 vNormal;
varying vec3 vTang;
varying vec4 vView;


/** 
 * This shader program does per-fragment Phong shading for multiple lights.
 * The shader supports ambient lights, point lights, directional lights, and
 * spot lights.
 */
void main(void) {
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  vView = mvTrans * vertexPos; // For doing the lighting math, we need to interpolate the position in View-space.
  
  vNormal = normalize(normalTrans*vertexNormal);
  vTang = normalize(normalTrans*vertexTang);
}
