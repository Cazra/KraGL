'use strict';

import { Material } from './Material';

/**
 * @typedef {object} TextureOpts
 * @property {string} url
 *           A URL from which to load the texture's image data.
 * @property {}
 */

/**
 * A 2D texture material.
 * TODO
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
   * @private
   * @param {WebGLRenderingContext} gl
   * @param {TextureOpts} opts
   */
  constructor(gl, opts) {
    super(opts);
    this._glTex = gl.createTexture();
  }

  /**
   * Asynchronously create a Texture.
   * @param {WebGLRenderingContext} gl
   * @param {TextureOpts} opts
   * @return {Promise<KraGL.materials.Texture>}
   */
  static create(gl, opts) {
    // TODO
    return Promise.resolve()
    .then(() => {
      return new Texture(gl, opts);
    });
  }

  /**
   * @inheritdoc
   */
  bind(app) {
    // TODO
    return Promise.resolve(app);
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
