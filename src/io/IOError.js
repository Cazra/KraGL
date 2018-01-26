'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error related to saving/loading resources or illegal operations
 * performed with input devices.
 * @memberof KraGL.io
 */
export class IOError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
