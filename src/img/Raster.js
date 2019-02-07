'use strict';

import { Ajax } from '../io';
import { RasterError } from './RasterError';

/**
 * @typedef {object} RasterOpts
 * @property {Uint8Array} data
 *           The raster's raw pixel data.
 * @property {uint} height
 *           The raster's height.
 * @property {uint} width
 */

/**
 * A rectangular grid of pixels representing an image.
 * The pixels are stored in RGBA byte format as a Uint8Array
 * (4 bytes per pixel). We assume that the first pixel is located in the
 * upper-left corner of the raster's image. Be mindful that on the GPU,
 * the first pixel is located at the lower-left corner.
 * @memberof KraGL.img
 */
export class Raster {
  /**
   * The raster's underlying pixel data.
   * @type {Uint8Array}
   */
  get data() {
    return this._data;
  }

  /**
   * The raster's height.
   * @type {uint}
   */
  get height() {
    return this._height;
  }

  /**
   * The raster's width.
   * @type {uint}
   */
  get width() {
    return this._width;
  }

  /**
   * @param {RasterOpts} opts
   */
  constructor(opts) {
    if(opts.height <= 0)
      throw new RasterError('Raster height must be greater than 0.');
    if(opts.width <= 0)
      throw new RasterError('Raster width must be greater than 0.');

    this._data = opts.data;
    this._height = opts.height;
    this._width = opts.width;
  }

  /**
   * Produces a new Raster from a Canvas element's image data.
   * @param {HTMLCanvasElement} canvas
   * @param {RasterOpts} [opts]
   * @return {Promise<KraGL.img.Raster>}
   */
  static createFromCanvas(canvas, opts) {
    opts = opts || {};
    let width = canvas.width;
    let height = canvas.height;
    let data = new Uint8Array(width * height * 4);

    // Copy the canvas's data to the typed array.
    let ctx = canvas.getContext('2d');
    let imgData = ctx.getImageData(0, 0, width, height);
    _.each(imgData.data, (byte, index) => {
      data[index] = byte;
    });

    // Create the raster.
    _.extend(opts, { data, height, width });
    let raster = new Raster(opts);
    return Promise.resolve(raster);
  }

  /**
   * Produces a new Raster from an Image element.
   * @param {Image} image
   * @param {RasterOpts} [opts]
   * @return {Promise<KraGL.img.Raster>}
   */
  static createFromImage(image, opts) {
    opts = opts || {};

    // Draw the image to a canvas.
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Create the raster.
    return Raster.createFromCanvas(canvas, opts);
  }

  /**
   * Produces a new Raster from an image located at some URL.
   * @param {string} url
   * @param {RasterOpts} [opts]
   * @return {Promise<KraGL.img.Raster>}
   */
  static createFromURL(url, opts) {
    opts = opts || {};

    return Ajax.getImage(url)
    .then(image => {
      return Raster.createFromImage(image, opts);
    });
  }

  /**
   * Produces a new Raster from a loaded WebGLTexture.
   * @param {WebGLRenderingContext} gl
   * @param {WebGLTexture} tex
   * @param {uint} width
   *        WebGL 1 has no way to get the width of a loaded texture, so it
   *        must be provided.
   * @param {uint} height
   *        WebGL 1 has no way to get the height of a loaded texture, so it
   *        must be provided.
   * @param {RasterOpts} [opts]
   */
  static createFromWebGLTexture(gl, tex, width, height, opts) {
    opts = opts || {};
    if(!width || !height)
      throw new RasterError('Must provide non-zero width and height.');

    let data = new Uint8Array(width * height * 4);

    // Get the current Framebuffer so we can restore it later.
    let origFrameBuffer = gl.getParameter(GL_FRAMEBUFFER_BINDING);

    // Draw the texture to an offscreen Framebuffer.
    let offscreenBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(GL_FRAMEBUFFER, offscreenBuffer);
    gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
      GL_TEXTURE_2D, tex, 0);

    // Read the pixels from the offscreen Framebuffer into the typed array
    // used to create our Raster.
    return Promise.resolve()
    .then(() => {
      if(gl.checkFramebufferStatus(GL_FRAMEBUFFER) ===
          GL_FRAMEBUFFER_COMPLETE) {
        gl.readPixels(0, 0, width, height, GL_RGBA, GL_UNSIGNED_BYTE, data);
        _.extend(opts, { data, height, width });
        return new Raster(opts);
      }
      else
        throw new RasterError(
          `Could not read texel data from WebGLTexture ${tex}.`);
    })
    .finally(() => {
      // Restore the original Framebuffer and clean up the temporary
      // GL resources.
      gl.bindFramebuffer(GL_FRAMEBUFFER, origFrameBuffer);
      gl.deleteFramebuffer(offscreenBuffer);
    });
  }

  /**
   * Creates a copy of this Raster.
   * @return {KraGL.img.Raster}
   */
  clone() {
    return new Raster({
      data: this.data.slice(0),
      height: this.height,
      width: this.width
    });
  }

  /**
   * Creates a cropped copy of this Raster.
   * @param {uint} x
   * @param {uint} y
   * @param {uint} width
   * @param {uint} height
   * @return {KraGL.img.Raster}
   */
  crop(x, y, width, height) {
    let data = new Uint8Array(width * height * 4);
    let raster = new Raster({ data, height, width });
    raster._iteratePixels((dstX, dstY) => {
      let srcX = x + dstX;
      let srcY = y + dstY;
      let color = this.getPixel(srcX, srcY);
      raster.setPixel(dstX, dstY, color);
    });
    return raster;
  }

  /**
   * Creates a copy of this raster with the X-axis flipped.
   * @return {KraGL.img.Raster}
   */
  flipX() {
    let raster = this.clone();
    this._iteratePixels((srcX, srcY, index, color) => {
      let dstX = this.width - srcX - 1;
      let dstY = srcY;
      raster.setPixel(dstX, dstY, color);
    });
    return raster;
  }

  /**
   * Creates a copy of this raster with the Y-axis flipped.
   * @return {KraGL.img.Raster}
   */
  flipY() {
    let raster = this.clone();
    this._iteratePixels((srcX, srcY, index, color) => {
      let dstX = srcX;
      let dstY = this.height - srcY - 1;
      raster.setPixel(dstX, dstY, color);
    });
    return raster;
  }

  /**
   * Gets the color of a pixel in the raster, given its x,y coordinates.
   * This color is returned as a Uint8Array containing the color in RGBA byte
   * format.
   * @param {uint} x
   * @param {uint} y
   * @return {Uint8Array}
   */
  getPixel(x, y) {
    let index = this._getPixelIndex(x, y);
    return this.data.slice(index, index + 4);
  }

  /**
   * Gets the index of a pixel in the raster, given its x,y coordinates.
   * @param {uint} x
   * @param {uint} y
   * @return {uint}
   */
  _getPixelIndex(x, y) {
    if(x < 0 || x >= this.width || y < 0 || y >= this.height)
      throw new RasterError(`Coordinates (${x},${y}) are out of bounds. ` +
        `Expected to be within (${this.width},${this.height}).`);
    return (this.width * y + x) * 4;
  }

  /**
   * Iterates over each pixel in this Raster.
   * @param {func<uint, uint, uint, vec4>} pixelCallback
   *        A callback function invoked for each processed pixel.
   *        The parameters are, in order:
   *        - x coordinate,
   *        - y coordinate,
   *        - pixel index,
   *        - pixel color in RGBA byte format
   */
  _iteratePixels(pixelCallback) {
    _.each(_.range(this.width), x => {
      _.each(_.range(this.height), y => {
        let index = this._getPixelIndex(x, y);
        let color = this.data.slice(index, index + 4);

        pixelCallback(x, y, index, color);
      });
    });
  }

  /**
   * Sets the color of a pixel in the raster.
   * @param {uint} x
   * @param {uint} y
   * @param {vec4} color
   *        The new pixel color in RGBA byte format.
   */
  setPixel(x, y, color) {
    let index = this._getPixelIndex(x, y);
    _.each(_.range(4), offset => {
      this.data[index + offset] = color[offset];
    });
  }

  /**
   * Produces a Canvas element from this Raster.
   * @return {HTMLCanvasElement}
   */
  toCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    let ctx = canvas.getContext('2d');
    let imgData = ctx.createImageData(this.width, this.height);

    // Fill the image data with the pixel data from this raster.
    this._iteratePixels((x, y, index, color) => {
      imgData.data[index] = color[0];
      imgData.data[index + 1] = color[1];
      imgData.data[index + 2] = color[2];
      imgData.data[index + 3] = color[3];
    });
    ctx.putImageData(imgData, 0, 0);

    // If we have the KraGL debugging container, add the canvas to it.
    let debugContainer = document.querySelector(`#${KraGL.DEBUG_ELEM_ID}`);
    if(debugContainer)
      debugContainer.appendChild(canvas);

    return canvas;
  }
}
