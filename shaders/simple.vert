attribute vec3 vertexNormal;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

uniform mat4 mvpTrans;
uniform mat3 normalTrans;

varying vec2 texCoords;
varying vec3 vNormal;

// pass-through shader.
void main(void) {
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  vNormal = normalize(normalTrans*vertexNormal);
}