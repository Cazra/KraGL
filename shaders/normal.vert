attribute vec3 vertexNormal;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

uniform mat4 mvpTrans;
uniform mat3 normalTrans;

varying vec2 texCoords;
varying vec3 vNormal;

void main(void) {
  mat3 nt = normalTrans;
  
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  
  vNormal = normalize(vertexNormal);
}