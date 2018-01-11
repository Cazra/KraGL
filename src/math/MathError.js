'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error arising from mathematical operations.
 */
class MathError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
export { MathError };
