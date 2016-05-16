define('KraGL.math.Transforms', ['KraGL.math'], function() {
  'use strict';

  /**
   * @class Transforms
   * @memberof KraGL.math
   * @classdesc A collection of common functions to do with affine transformations.
   */
  KraGL.math.Transforms = {

    /**
     * Creates a change of basis matrix from 3 axis vectors. The axis vectors
     * are assumed to be orthogonal to each other.
     * @param {vec3} a
     * @param {vec3} b
     * @param {vec3} c
     * @return {mat3}
     */
    changeOfBasis: function(a, b, c) {
      return [
        a[0], a[1], a[2],
        b[0], b[1], b[2],
        c[0], c[1], c[2]
      ];
    },


    /**
     * Rotates a 3D point counter-clockwise around an arbitrary axis.
     * @param  {vec4} p
     *         The point to be rotated.
     * @param  {vec3} [axis=[0,0,1]]
     *         The unit vector for the rotation axis.
     * @param  {number} angle
     *         The angle, in radians.
     * @return {vec4}
     *         The rotated point.
     */
    rotatePt: function(p, axis, angle) {
      if(isNaN(angle)) {
        angle = axis;
        axis = [0,0,1];
      }
      if(axis[0] === 0 && axis[1] === 0 && axis[2] === 0)
        return [NaN, NaN, NaN, p[3]];
      var q = quat.setAxisAngle([], axis, angle);
      return vec4.transformQuat([], p, q);
    },

    /**
     * Rotates a 2D point counter-clockwise around the positive Z axis.
     * @param  {vec3} p
     *         The point to be rotated.
     * @param  {number} angle
     *         The angle, in radians.
     * @return {vec3}
     *         The rotated point.
     */
    rotatePt2D: function(p, angle) {
      var m = mat3.fromRotation([], angle);
      return vec3.transformMat3([], p, m);
    },


    /**
     * Scales a 3D point relative to the origin.
     * @param  {vec4} p
     *         The point.
     * @param  {(number|vec3)} s
     *         The uniform scale amount or scale vector.
     * @return {vec4}
     *         The scaled point.
     */
    scalePt: function(p, s) {
      if(!_.isArray(s))
        s = [s,s,s];

      return [
        p[0] * s[0],
        p[1] * s[1],
        p[2] * s[2],
        p[3]
      ];
    },

    /**
     * Scales a 2D point relative to the origin.
     * @param  {vec3} p
     *         The point
     * @param  {(number|vec2)} s
     *         The uniform scale amount or scale vector.
     * @return {vec3}
     *         The scaled point.
     */
    scalePt2D: function(p, s) {
      if(!_.isArray(s))
        s = [s,s];

      return [
        p[0] * s[0],
        p[1] * s[1],
        p[2]
      ];
    },

    /**
     * Translates a 3D point.
     * @param  {vec4} p
     *         The point.
     * @param  {vec3} v
     *         The translation vector.
     * @return {vec4}
     *         The translated point.
     */
    translatePt: function(p, v) {
      var result = vec4.add([], p, v);
      result[3] = p[3];
      return result;
    },

    /**
     * Translates a 2D point.
     * @param {vec3} p
     *        The point.
     * @param {vec2} v
     *        The translation vector.
     * @return {vec3}
     *         The translated point.
     */
    translatePt2D: function(p, v) {
      var result = vec3.add([], p, v);
      result[2] = p[2];
      return result;
    }
  };
});
