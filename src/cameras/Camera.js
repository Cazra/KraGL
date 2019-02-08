'use strict';

import { AbstractError } from '../AbstractError';

/**
 * Base class for all 2D and 3D cameras.
 * @memberof KraGL.cameras
 */
export class Camera {

  /**
   * The projection transform for the camera. This transforms the scene from
   * view space to clip space.
   * @type {mat4}
   */
  get projection() {
    throw new AbstractError();
  }

  /**
   * The view transform for the camera. This transforms the scene from
   * world space to view space.
   * @type {mat4}
   */
  get view() {
    throw new AbstractError();
  }

  constructor() {}
}
