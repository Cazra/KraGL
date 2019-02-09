'use strict';

import {
  Line,
  LinearShape,
  Matrices
} from '../math';
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

  /**
   * The viewport defining the camera's width and height.
   * // TODO: Define Viewport interface.
   * @type {Viewport}
   */
  get viewport() {
    throw new AbstractError();
  }

  /**
   * The 8 corners of the camera's clip volume in world coordinates.
   * The first four points are the corners of the near clipping rectangle.
   * The last four points are the corners of the far clipping rectangle.
   * From both of these groups, the first point is in the upper-left
   * corner of the viewport, the second is the upper-right corner of
   * the viewport, the third is the lower-right corner of the
   * viewport, and the fourth is the lower-left corner of the viewport.
   * @type {vec4[]}
   */
  get worldClipCorners() {
    let [upperLeftNear, upperLeftFar] =
      this.projectToClipPlanes([0, 0]);
    let [upperRightNear, upperRightFar] =
      this.projectToClipPlanes([this.viewport.width, 0]);
    let [lowerRightNear, lowerRightFar] =
      this.projectToClipPlanes([this.viewport.width, this.viewport.height]);
    let [lowerLeftNear, lowerLeftFar] =
      this.projectToClipPlanes([0, this.viewport.height]);

    return [
      upperLeftNear, upperRightNear, lowerRightNear, lowerLeftNear,
      upperLeftFar, upperRightFar, lowerRightFar, lowerLeftFar
    ];
  }

  constructor() {}

  /**
   * Converts a point in the camera's viewport to its corresponding
   * world coordinates on the near and far clipping planes.
   * @param {vec2} pt
   *        The point in viewport coordinates.
   * @return {vec4[]}
   */
  projectToClipPlanes(pt) {
    let matViewportTrans = mat4.fromTranslation([], [1, -1, 0]);
    let matViewportScale = mat4.fromScaling([],
      [this.viewport.width/2, -this.viewport.height/2, 1]);

    let matViewport = mat4.mul([], matViewportScale, matViewportTrans);
    let mat = Matrices.glChainMul4([ matViewport, this.projection, this.view ]);
    let matInv = mat4.invert([], mat);

    let ptNear = [...pt, -1, 1];
    let ptFar = [...pt, 1, 1];

    let worldNear = vec4.transformMat4([], ptNear, matInv);
    let worldFar = vec4.transformMat4([], ptFar, matInv);
    return [worldNear, worldFar];
  }

  /**
   * Projects a points in the camera's viewport onto a plane in world space.
   * @param {vec2} pt
   *        The point in viewport coordinates.
   * @param {KraGL.math.Plane} plane
   *        The plane pt is being projected onto.
   * @return {vec4}
   */
  projectToPlane(pt, plane) {
    let [worldNear, worldFar] = this.projectToClipPlanes(pt);
    let line = new Line({ p1: worldNear, p2: worldFar });
    let projection = plane.intersection(line);

    // Ignore projections that result in lines. We're only interested in point
    // interesections here.
    if(projection instanceof LinearShape)
      return undefined;
    else
      return projection;
  }
}
