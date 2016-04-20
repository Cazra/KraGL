KraGL.define('KraGL.math.Quaternion', ['KraGL.math'], function() {
  'use strict';

  /**
   * @class Quaternion
   * @memberof KraGL.math
   * @classdesc A collection of static methods for doing Quaternion
   * rotation and orientation operations.
   */
  KraGL.math.Quaternion = {


    orient: function(startBasis, endBasis) {

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
      var axis = vec3.cross([], uHat, vHat);

      return quat.setAxisAngle([], axis, angle);
    }
  };
});
