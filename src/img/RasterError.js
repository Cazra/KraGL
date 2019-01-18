'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error related to Raster operations.
 * @memberof KraGL.img
 */
export class RasterError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
