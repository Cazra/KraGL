/**
 * 3D picker vertex shader
 */
attribute vec4 vertexPos;
attribute vec2 vertexTexCoords;

uniform mat4 mvpTrans;

varying vec2 texCoords;

// pass-through shader.
void main(void) {
  gl_Position = mvpTrans * vertexPos;
  texCoords = vertexTexCoords;
}

