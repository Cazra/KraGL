'use strict';

/**
 * Utilities concerning Canvas objects.
 */
export class Canvas {

  /**
   * Resizes a canvas's pixel size to its display size.
   * @param {Element} canvas
   *        An HTML canvas element.
   */
  static resizeToDisplay(canvas) {
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    if(canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }
}
