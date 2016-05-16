define('KraGL.math.Vectors', ['KraGL.math'], function() {
  'use strict';

  /**
   * @class Vectors
   * @memberof KraGL.math
   * @classdesc A collection of common vector math operations.
   */
  KraGL.math.Vectors = {

    /**
     * Checks if two vectors are parallel.
     * @param {vec3} u
     * @param {vec3} v
     * @param {number} tolerance
     * @return {boolean}
     */
    parallel: function(u, v, tolerance) {
      var sin = vec3.length(vec3.cross([], u, v));
      return KraGL.Math.approx(sin, 0, tolerance);
    },

    /**
     * Calculates the reflection vector of some incident vector.
     * See: https://www.opengl.org/sdk/docs/man/html/reflect.xhtml
     * @param  {vec3} i
     *         The normalized incident vector.
     * @param  {vec3} n
     *         The normalized surface normal vector.
     * @return {vec3}
     */
    reflect: function(i, n) {
      var scalar = 2*vec3.dot(n, i);
      return vec3.sub([], i, vec3.scale([], n, scalar));
    },

    /**
     * Calculates the refraction vector of some incident vector.
     * See: https://www.opengl.org/sdk/docs/man/html/refract.xhtml
     * @param  {vec3} i
     *         The normalized incident vector.
     * @param  {vec3} n
     *         The normalized surface normal vector.
     * @param  {number} eta
     *         The ratio of indices of refraction.
     * @return {vec3}
     */
    refract: function(i, n, eta) {
      var dotNI = vec3.dot(n,i);
      var k = 1.0 - eta*eta * (1.0 - dotNI*dotNI);
      if(k < 0)
        return [0, 0, 0];
      else {
        // eta * i - (eta * dot(n, i) + sqrt(k)) * n
        return vec3.sub([],
          vec3.scale([], i, eta),
          vec3.scale([], n, eta*dotNI + Math.sqrt(k))
        );
      }
    },

    /**
     * Computes the scalar projection of v onto u. This is also the length
     * of the projection of v onto u.
     * You can get the projection of v onto u by scaling uHat by this value.
     * @param  {(vec2|vec3|vec4)} u
     * @param  {(vec2|vec3|vec4)} v
     * @return {number}
     */
    scalarProjection: function(u, v) {
      var clazz = vec2;
      if(u.length === 3)
        clazz = vec3;
      if(u.length === 4)
        clazz = vec4;

      var uHat = clazz.normalize([], u);
      return clazz.dot(uHat, v);
    },

    /**
     * Spherically interpolates between two vectors.
     * @param  {vec3} u
     *         The start vector.
     * @param  {vec3} v
     *         The end vector.
     * @param  {number} a
     *         The parametric value
     * @return {vec3}
     */
    slerp: function(u, v, a) {
      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      var nHat = vec3.normalize([], vec3.cross([], u, v));
      if(nHat.length === 0)
        return vec3.lerp([], u, v, a);

      var theta = Math.acos(vec3.dot(uHat, vHat))*a;

      var lenU = vec3.len(u);
      var lenV = vec3.len(v);
      var length = KraGL.Math.mix(a, [lenU, lenV]);

      var q = quat.setAxisAngle([], nHat, theta);
      return vec3.scale([], vec3.transformQuat([], uHat, q), length);
    }
  };
});
