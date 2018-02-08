'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error dealing with errors in compiling ShaderPrograms or with
 * using ShaderPrograms.
 * @memberof KraGL.shaders
 * @extends KraGL.KraGLError
 */
class ShaderError extends KraGLError {
  constructor(msg) {
    super(msg);
    this._isShaderError = true;
  }
}
export { ShaderError };
