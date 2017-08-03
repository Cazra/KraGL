'use strict';

/**
 * A basis consisting of 3 orthogonal axes.
 * @typedef {number[][]} basis
 */

/**
 * A collection of common functions for Quaternion operations.
 * @memberof KraGL.math
 */
class Quaternions {

  /**
   * Creates a quaternion for orienting from one unit basis to another.
   * @param {basis} startBasis
   * @param {basis} [endBasis] If this is not provided, then startBasis will
   *   be used for the endBasis argument and the
   *   start basis will be the standard basis.
   * @return {quat}
   */
  static orient(startBasis, endBasis) {
    if(!endBasis) {
      endBasis = startBasis;
      startBasis = [
        [1,0,0],
        [0,1,0],
        [0,0,1]
      ];
    }

    // Orient the X axes.
    let x1 = startBasis[0];
    let x2 = endBasis[0];
    let q1 = this.rotate(x1, x2);

    // Orient the Y axes.
    let y1 = startBasis[1];
    let y2 = vec3.transformQuat([], y1, q1);
    let y3 = endBasis[1];
    let q2 = this.rotate(y2, y3);

    // Rotate by q1, then by q2.
    return quat.multiply([], q2, q1);
  }

  /**
   * Creates a quaternion that performs a rotation from one vector to another.
   * @param {vec3} u
   * @param {vec3} v
   * @return {quat}
   */
  static rotate(u, v) {
    let uHat = vec3.normalize([], u);
    let vHat = vec3.normalize([], v);

    let cos = vec3.dot(uHat, vHat);
    let angle = Math.acos(cos);
    let crossUVHat = vec3.cross([], uHat, vHat);
    let axis = vec3.normalize([], crossUVHat);

    return quat.setAxisAngle([], axis, angle);
  }
}
export { Quaternions };
