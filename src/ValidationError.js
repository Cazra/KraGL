'use strict';

import { KraGLError } from './KraGLError';

/**
 * A error arising from a validation problem.
 * @memberof KraGL
 * @extends KraGL.KraGLError
 */
class ValidationError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}

export { ValidationError };
