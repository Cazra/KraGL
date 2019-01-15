// An attribute that will receive vertex positions from a buffer.
attribute vec4 position;

void main() {
  // gl_Position is a special variable that the vertex shader is responsible
  // for setting. It sets the clip-space coordinates for a vertex.
  // Here, we just pass through whatever we receive from the buffer.
  gl_Position = position;
}
