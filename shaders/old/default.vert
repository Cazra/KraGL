attribute vec4 vertexPos;

// pass-through shader.
void main(void) {
  gl_Position = vertexPos;
}