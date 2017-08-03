'use strict';

/**
 * A collection of common functions for affine transformations.
 * @memberof KraGL.math
 */
class Transforms {

  /**
   * Creates a change of basis matrix from 3 axis vectors.
   * The axis vectors are assumed to be orthogonal to each other.
   * @param {vec3} a
   * @param {vec3} b
   * @param {vec3} c
   * @return {mat3}
   */
  static changeOfBasis(a, b, c) {
    return [
      a[0], a[1], a[2],
      b[0], b[1], b[2],
      c[0], c[1], c[2]
    ];
  }

  /**
   * Rotates a 3D point counter-clockwise around some axis.
   * @param {vec4} pt
   * @param {vec3} axis The unit vector for the rotation axis.
   * @param {number} angle The rotation angle, in radians.
   * @return {vec4}
   */
  static rotatePt(pt, axis, angle) {
    if(vec3.len(axis) === 0)
      return [NaN, NaN, NaN, pt[3]];
    let q = quat.setAxisAngle([], axis, angle);
    return vec4.transformQuat([], pt, q);
  }

  /**
   * Rotates a 2D point counter-clockwise around the positive Z axis.
   * @param {vec3} pt
   * @param {number} angle The rotation angle, in radians.
   * @return {vec3}
   */
  static rotatePt2D(pt, angle) {
    let m = mat3.fromRotation([], angle);
    return vec3.transformMat3([], pt, m);
  }

  /**
   * Scales a 3D point relative to the origin.
   * @param {vec4} pt
   * @param {(number|vec3)} s The scalar, either as a uniform value or by axes.
   * @return {vec4}
   */
  static scalePt(pt, s) {
    if(_.isNumber(s))
      s = [s,s,s];

    return [
      pt[0] * s[0],
      pt[1] * s[1],
      pt[2] * s[2],
      pt[3]
    ];
  }

  /**
   * Scales a 2D point relative to the origin.
   * @param {vec3} pt
   * @param {(number|vec3)} s The scalar, either as a uniform value or by axes.
   * @return {vec3}
   */
  static scalePt2D(pt, s) {
    if(_.isNumber(s))
      s = [s,s];

    return [
      pt[0] * s[0],
      pt[1] * s[1],
      pt[2]
    ];
  }

  /**
   * Translates a 3D point.
   * @param {vec4} pt
   * @param {vec3} v
   * @return {vec4}
   */
  static translatePt(pt, v) {
    let result = vec4.add([], pt, v);
    result[3] = pt[3];
    return result;
  }

  /**
   * Translates a 2D point.
   * @param {vec3} pt
   * @param {vec2} v
   * @return {vec3}
   */
  static translatePt2D(pt, v) {
    let result = vec3.add([], pt, v);
    result[2] = pt[2];
    return result;
  }
}
export { Transforms };
