attribute vec3 vertexNormal;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

uniform mat4 mvpTrans;
uniform mat3 normalTrans;

varying vec3 vNormal;

// It is impossible to keep texture coordinates for an infinite plane. 
// Therefore, we will compute the texture coordinates as a function of our world coordinates.
varying vec3 worldCoords;

void main(void) {
  vec2 st = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  worldCoords = vertexPos.xyz;
  vNormal = normalize(normalTrans*vertexNormal);
}