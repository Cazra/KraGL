// Fragment shaders don't have a default precision, so let's use
// medium precision.
precision mediump float;

void main() {
  // gl_FragColor is a special variable that the fragment is responsible for
  // setting. It sets the color for the current pixel.
  // Colors are given in RGBA order.
  // Here, we color every pixel white.
  gl_FragColor = vec4(1, 1, 1, 1);
}
