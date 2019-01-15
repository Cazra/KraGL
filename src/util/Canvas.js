'use strict';

import { Color } from '../materials';

/**
 * Utilities concerning Canvas objects.
 */
export class Canvas {

  /**
   * Clears the canvas bound to a GL object.
   * @param {WebGLRenderingContext} gl
   * @param {(KraGL.materials.Color|vec4)} [color]
   *        The color used to clear the canvas.
   *        If given as a vec4, it must be in normalized RGBA format.
   *        By default, it will clear with transparent black [0,0,0,0].
   * @param {GLEnum} [bufferBit]
   *        The bit code for the buffer being cleared.
   *        By default, this is the color buffer.
   */
  static clear(gl, color=[0,0,0,0], bufferBit=GL_COLOR_BUFFER_BIT) {
    if(color instanceof Color)
      color = color.rgba;
    else if(color.length !== 4)
      throw new KraGLError('Clear color must be in normalized RGBA format.');

    gl.clearColor(...color);
    gl.clear(bufferBit);
  }

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
