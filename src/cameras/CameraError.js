'use strict';

import { KraGLError } from '../KraGLError';

/**
 * An error related to a camera and the computation of its transforms.
 * @memberof KraGL.cameras
 * @extends KraGL.KraGLError
 */
export class CameraError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
