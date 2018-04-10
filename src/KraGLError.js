'use strict';

/**
 * Used for throwing errors within the KraGL library.
 * @memberof KraGL
 * @extends Error
 */
export class KraGLError extends Error {
  constructor(msg) {
    super(msg);
  }
}
