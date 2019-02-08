'use strict';

import { Matrices } from '../math';
import { Camera } from './Camera';
import { CameraError } from './CameraError';

/**
 * A camera for a 2D scenes.
 * @memberof KraGL.cameras
 * @extends KraGL.cameras.Camera
 */
export class Camera2D extends Camera {

  /**
   * The position of the camera's focal point in viewport coordinates.
   * @type {vec2}
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(xy) {
    this._anchor = xy;
  }

  /**
   * The position of the camera's focal point in world coordinates.
   * @type {vec2}
   */
  get eye() {
    return this._eye;
  }
  set eye(xy) {
    this._eye = xy;
  }

  /**
   * The height of the camera's resolution in pixels.
   * @type {number}
   */
  get height() {
    return this._height;
  }
  set height(height) {
    this.resolution = [this.width, height];
  }

  /**
   * @inheritdoc
   */
  get projection() {
    let matInvertY = mat4.create();
    if(this.invertY)
      matInvertY = mat4.fromScaling([], [1, -1, 1]);

    let matOrigin = mat4.fromTranslation([], [-1, -1, 0]);
    let matResolution = mat4.fromScaling([], [2/this.width, 2/this.height, 1]);

    return Matrices.glChainMul4([matInvertY, matOrigin, matResolution]);
  }

  /**
   * The dimensions of the camera's screen. The first element is its width,
   * and the second is its height.
   * @type {vec2}
   */
  get resolution() {
    return [this.width, this.height];
  }
  set resolution(resolution) {
    let [width, height] = resolution;

    if(width <= 0)
      throw new CameraError('Camera width must be > 0.');
    if(height <= 0)
      throw new CameraError('Camera height must be > 0.');

    this._width = width;
    this._height = height;
  }

  /**
   * The rotation angle of the camera around its focal point, in radians.
   * Incrementing this will cause the world to appear to rotate clockwise.
   * @type {number}
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(radians) {
    this._rotation = radians;
  }

  /**
   * @inheritdoc
   */
  get view() {
    let matAnchor = mat4.fromTranslation([],
      [this.anchor[0], this.anchor[0], 0]);
    let matZoom = mat4.fromScaling([], [this.zoom, this.zoom, 1]);
    let matRotate = mat4.fromRotateZ([], this.rotation);
    let matEye = mat4.fromTranslation([], [-this.eye[0], -this.eye[1], 0]);

    return Matrices.glChainMul4([matAnchor, matZoom, matRotate, matEye]);
  }

  /**
   * The width of the camera's resolution in pixels.
   * @type {number}
   */
  get width() {
    return this._width;
  }
  set width(width) {
    this.resolution = [width, this.height];
  }

  /**
   * The zoom scale of the camera toward or away from its focal point,
   * within the range (0, Infinity). 1 is the normal zoom level.
   * Large numbers are zoomed in. Small numbers are zoomed out.
   * @type {number}
   */
  get zoom() {
    return this._zoom;
  }
  set zoom(scale) {
    if(scale <= 0)
      throw new CameraError('Camera zoom must be > 0.');

    this._zoom = scale;
  }

  /**
   * @param {number} width
   *        The width of the camera's screen in pixels.
   * @param {number} height
   *        The height of the camera's screen in pixels.
   * @param {object} [opts]
   * @param {vec2} [opts.anchor]
   *        The initial position of the camera's focal point in viewport
   *        coordinates.
   *        By default, this is centered in the middle of the viewport.
   * @param {vec2} [opts.eye]
   *        The initial position of the camera's focal point in world
   *        coordinates.
   *        By default, this is set at the origin.
   * @param {boolean} [invertY=true]
   *        Whether to invert the Y axis such that Y increases downward (this
   *        is common for most 2D applications).
   * @param {number} [rotation=0]
   *        The initial rotation of the camera, in radians.
   * @param {number} [zoom=1]
   *        The initial zoom level of the camera.
   */
  constructor(width, height, opts) {
    super();
    opts = opts || {};
    this.resolution = [width, height];
    this.eye = _.clone(opts.eye) || [0, 0];
    this.anchor = _.clone(opts.anchor) || [width/2, height/2];
    this.rotation = opts.rotation || 0;
    this.zoom = 1;
    this.invertY = opts.invertY || true;
  }
}
