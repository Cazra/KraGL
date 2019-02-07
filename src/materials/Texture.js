'use strict';

import { Raster } from '../img';
import { Material } from './Material';

/**
 * @typedef {object} TextureOpts
 * @property {KraGL.img.ImageFilter[]} [filters]
 *           A list of filters for postprocessing the image raster data for the
 *           texture. The filters will be applied in the order they're given
 *           in this list.
 * @property {RasterOpts} [rasterOpts]
 *           Options for creating the texture's raster.
 */

/**
 * A 2D texture material.
 */
export class Texture extends Material {

  /**
   * The GL texture associated with this material.
   * @type {WebGLTexture}
   */
  get glTexture() {
    return this._glTex;
  }

  /**
   * The GL texture unit affected by this material.
   * For regular textures, this is always GL_TEXTURE0.
   * @type {GLenum}
   */
  get glTextureUnit() {
    return GL_TEXTURE0;
  }

  /**
   * @private
   * @param {WebGLRenderingContext} gl
   * @param {TextureOpts} opts
   */
  constructor(gl, raster, opts) {
    super(opts);
    this._glTex = gl.createTexture();

    // Load the raster data into GL memory for the texture.
    gl.bindTexture(GL_TEXTURE_2D, this._glTex);
    gl.texImage2D(GL_TEXTURE_2D, GL_RGBA, raster.width, raster.height, 0,
      GL_RGBA, GL_UNSIGNED_BYTE, raster.data);

    // Enable mipmapping if the dimensions of the texture are powers of 2.
    if(KraGL.math.isPowerOf2(raster.width) &&
        KraGL.math.isPowerOf2(raster.height))
      gl.generateMipmap(GL_TEXTURE_2D);
    else {
      gl.texParameteri(gl.TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    }
  }

  /**
   * Asynchronously create a Texture from a canvas element.
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} canvas
   * @param {TextureOpts} opts
   * @return {Promise<KraGL.materials.Texture>}
   */
  static createFromCanvas(gl, canvas, opts) {
    return Raster.createFromCanvas(canvas, opts.rasterOpts)
    .then(raster => {
      return Texture.createFromRaster(gl, raster, opts);
    });
  }

  /**
   * Asynchronously create a Texture from an image element.
   * @param {WebGLRenderingContext} gl
   * @param {Image} image
   * @param {TextureOpts} opts
   * @return {Promise<KraGL.materials.Texture>}
   */
  static createFromImage(gl, image, opts) {
    return Raster.createFromImage(image, opts.rasterOpts)
    .then(raster => {
      return Texture.createFromRaster(gl, raster, opts);
    });
  }

  /**
   * Asynchronously create a Texture from a Raster.
   * @param {WebGLRenderingContext} gl
   * @param {KraGL.img.Raster} raster
   * @param {TextureOpts} opts
   * @return {Promise<KraGL.materials.Texture>}
   */
  static createFromRaster(gl, raster, opts) {
    // Asynchronously apply the filters (if any) to the raster.
    let filterPromise = Promise.resolve(raster);
    _.each(opts.filters, filter => {
      filterPromise = filterPromise
      .then(curRaster => {
        return filter.filterRaster(curRaster);
      });
    });

    // Create the texture from the filtered raster.
    return filterPromise
    .then(filteredRaster => {
      let texture = new Texture(gl, filteredRaster, opts);
      return Promise.resolve(texture);
    });
  }

  /**
   * Asynchronously create a Texture from a URL.
   * @param {WebGLRenderingContext} gl
   * @param {string} url
   * @param {TextureOpts} opts
   * @return {Promise<KraGL.materials.Texture>}
   */
  static createFromURL(gl, url, opts) {
    return Raster.createFromURL(url, opts.rasterOpts)
    .then(raster => {
      return Texture.createFromRaster(gl, raster, opts);
    });
  }

  /**
   * @inheritdoc
   */
  bind(app) {
    let gl = app.gl;
    gl.activeTexture(GL_TEXTURE0);
    gl.bindTexture(GL_TEXTURE_2D, this.glTexture);

    // Assign the uniform used for textures to texture unit 0.
    let uniform = app.shaderLib.curProgram.getPropertyUniform('texture');
    uniform.value = 0;
  }

  /**
   * @inheritdoc
   */
  clean(gl) {
    return Promise.resolve()
    .then(() => {
      gl.deleteTexture(this._glTex);
    });
  }
}
