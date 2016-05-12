define('KraGL.math.Quaternion', ['KraGL.math'], function() {
  'use strict';

  /**
   * @class Quaternion
   * @memberof KraGL.math
   * @classdesc A collection of static methods for doing Quaternion
   * rotation and orientation operations.
   */
  KraGL.math.Quaternion = {

    /**
     * Returns the quaternion for orienting startBasis to endBasis.
     * @param  {basis} startBasis
     * @param  {basis} endBasis
     * @return {quat}
     */
    orient: function(startBasis, endBasis) {
      var xAxis1 = startBasis[0];
      var xAxis2 = endBasis[0];
      var q1 = this.rotate(xAxis1, xAxis2);

      var yAxis1 = startBasis[1];
      var yAxis2 = vec3.transformQuat([], yAxis1, q1);
      var yAxis3 = endBasis[1];
      return this.rotate(yAxis2, yAxis3);
    },

    /**
     * Produces a quat that performs a rotation from u to v.
     * @param  {vec3} u
     * @param  {vec3} v
     * @return {quat}
     */
    rotate: function(u, v) {
      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      var angle = Math.acos(vec3.dot(uHat, vHat));
      var axis = vec3.normalize([], vec3.cross([], uHat, vHat));
      return quat.setAxisAngle([], axis, angle);
    }
  };
});
