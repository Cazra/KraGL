define('KraGL.math.Quaternions', ['KraGL.math'], function() {
  'use strict';

  /**
   * @class Quaternions
   * @memberof KraGL.math
   * @classdesc A collection of static methods for doing Quaternion
   * rotation and orientation operations.
   */
  KraGL.math.Quaternions = {

    /**
     * Returns the quaternion for orienting from one unit basis to another.
     * @param  {basis} [startBasis]
     *         The starting basis. If not specified, then a unit axis basis
     *         [[1,0,0], [0,1,0], [0,0,1]] will be used.
     * @param  {basis} endBasis
     * @return {quat}
     */
    orient: function(startBasis, endBasis) {
      if(!endBasis) {
        endBasis = startBasis;
        startBasis = [
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ];
      }

      var xAxis1 = startBasis[0];
      var xAxis2 = endBasis[0];
      var q1 = this.rotate(xAxis1, xAxis2);

      var yAxis1 = startBasis[1];
      var yAxis2 = vec3.transformQuat([], yAxis1, q1);
      var yAxis3 = endBasis[1];
      var q2 = this.rotate(yAxis2, yAxis3);
      return quat.multiply([], q2, q1);
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
