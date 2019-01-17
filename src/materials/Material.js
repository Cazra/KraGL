'use strict';

import { AbstractError } from '../AbstractError';

/**
 * Superclass for all types of materials used to render the surface of
 * geometries in a fragment shader.
 * @memberof KraGL.materials
 */
class Material {
  /**
   * @param {object} opts
   */
  constructor(opts) {
    _.noop(opts);
  }

  /**
   * Binds the resources associated with the material to the WebGL context
   * and to any shader variables that require it in the current shader.
   * @abstract
   * @param {WebGLRenderingContext} app
   */
  bind(app) {
    _.noop(app);
    throw new AbstractError();
  }

  /**
   * Unloads the resources associated with the material from the WebGL
   * context.
   * @abstract
   * @param {WebGL} gl
   * @return {Promise}
   */
  clean(gl) {
    _.noop(gl);
    throw new AbstractError();
  }

  /**
   * Loads all the resources associated with the material into the WebGL
   * context.
   * @abstract
   * @param {WebGL} gl
   * @return {Promise}
   */
  load(gl) {
    _.noop(gl);
    throw new AbstractError();
  }
}
export { Material };
