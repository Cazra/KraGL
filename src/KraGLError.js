'use strict';

/**
 * Used for throwing errors within the KraGL library.
 * @memberof KraGL
 */
class KraGLError extends Error {
  constructor(msg) {
    super(msg);
  }
}
export { KraGLError };
