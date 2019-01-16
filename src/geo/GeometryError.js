'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error dealing with errors in generating geometry.
 * @memberof KraGL.geo
 * @extends KraGL.KraGLError
 */
export class GeometryError extends KraGLError {
  constructor(msg) {
    super(msg);
    this._isGeometryError = true;
  }
}
