attribute vec3 vertexNormal;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

uniform mat4 mvpTrans;
uniform mat3 normalTrans;

uniform float extrudeAmt;

varying vec2 texCoords;
varying vec3 vNormal;

// Expands all vertices in the direction of their normals.
void main(void) {
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * (vertexPos + vec4(vertexNormal.xyz, 0)*extrudeAmt);
  vNormal = normalize(normalTrans*vertexNormal);
}