/**
 * 3D picker fragment shader.
 * All fragments are colored using their object's assigned pickID.
 */
precision mediump float;

uniform vec4 pickID;
uniform sampler2D tex;

varying vec2 texCoords;

void main(void) {
  if(texture2D(tex, texCoords).a == 0.0) {
    gl_FragColor = vec4(0,0,0,0);
    discard;
  }
  else {
    gl_FragColor = pickID;
  }
}
