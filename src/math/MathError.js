'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error arising from mathematical operations.
 * @memberof KraGL.math
 * @extends KraGL.KraGLError
 */
class MathError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
export { MathError };
