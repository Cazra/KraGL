'use strict';

/**
 * Utilities concerning Canvas objects.
 */
export class Canvas {

  /**
   * Resizes a WebGL canvas's pixel size to its display size.
   * This will also resize the GL viewport.
   * @param {WebGLRenderingContext} gl
   */
  static resizeToDisplay(gl) {
    let displayWidth = gl.canvas.clientWidth;
    let displayHeight = gl.canvas.clientHeight;

    if(gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
      gl.canvas.width = displayWidth;
      gl.canvas.height = displayHeight;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}
