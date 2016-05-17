define('KraGL.Math', ['KraGL'], function() {
  'use strict';

  /**
   * @class Math
   * @memberof KraGL
   * @classdesc A singleton with a bunch of common geometric and GLSL
   * math functions.
   */
  KraGL.Math = {
    /**
     * 2*PI radians.
     * @const
     * @default
     */
    TAU: Math.PI*2,

    /**
     * Tests if some value approximately equals another value within some
     * tolerance.
     * @param  {number} x
     * @param  {number} y
     * @param  {number} [tolerance=KraGL.EPSILON]
     * @return {boolean}
     */
    approx: function(x, y, tolerance) {
      tolerance = tolerance || KraGL.EPSILON;
      if(tolerance < 0)
        throw new Error('Negative tolerance value not allowed.');
      return Math.abs(x - y) <= tolerance;
    },

    /**
     * Converts a point in polar (spherical) coordinates to Cartesian coordinates.
     * The result is a homogenous 3D point.
     * @param  {vec3} point
     * @return {vec4}
     */
    cartesian: function(point) {
      point[2] = point[2] || 0;

      var r = point[0];
      if(r === 0)
        return [0,0,0,1];

      var cosTheta = Math.cos(point[1]);
      var sinTheta = Math.sin(point[1]);
      var cosPhi = Math.cos(point[2]);
      var sinPhi = Math.sin(point[2]);

      return [
        r*cosTheta*sinPhi,
        r*sinTheta*sinPhi,
        r*cosPhi,
        1
      ];
    },

    /**
     * Constraints a value to lie between two further values.
     * @param  {number} x
     * @param  {number} min
     * @param  {number} max
     * @return {number}
     */
    clamp: function(x, min, max) {
      return Math.max(min, Math.min(x, max));
    },

    /**
     * Converts an angle in radians to degrees.
     * @param  {number} radians
     * @return {number}
     */
    degrees: function(radians) {
      return radians/KraGL.Math.TAU*360;
    },

    /**
     * Gets the fractional part of x, computed as x - floor(x).
     * @param  {number} x
     * @return {number}
     */
    fract: function(x) {
      return x - Math.floor(x);
    },

    /**
     * Linearly maps a value from some domain to some range.
     * @param  {number} x
     * @param  {number[]} domain
     *         Two values specifying the bounds of the domain.
     * @param  {number[]} range
     *         Two values specifying the bounds of the range.
     * @return {number}
     */
    linearMap: function(x, domain, range) {
      var dDomain = domain[1] - domain[0];

      var alpha = (x-domain[0])/dDomain;
      return this.mix(alpha, range);
    },

    /**
     * Produces a linear blend the parametric value a in some range.
     * @param {number} a
     * @param {number[]} range
     * @return {number}
     */
    mix: function(a, range) {
      return range[0] + a*(range[1] - range[0]);
    },

    /**
     * Converts a vector into a vec4 representing a homogenous 3D point.
     * @param  {(vec2|vec3|vec4)} v
     * @return {vec4}
     */
    point: function(v) {
      return [
        v[0] || 0,
        v[1] || 0,
        v[2] || 0,
        1
      ];
    },

    /**
     * Converts a vector into a vec3 representing a homogenous 2D point.
     * @param  {(vec2|vec3|vec4)} v
     * @return {vec3}
     */
    point2D: function(v) {
      return [
        v[0] || 0,
        v[1] || 0,
        1
      ];
    },

    /**
     * Converts a point in Cartesian coordinates to polar
     * (actually 3D spherical) coordinates.
     * @param  {(vec3|vec4)} point
     * @return {vec3}
     */
    polar: function(point) {
      point[2] = point[2] || 0;
      var dist = vec3.dist(point, [0,0,0]);
      if(dist === 0)
        return [0,NaN,NaN];
      else
        return [
          dist,
          Math.atan2(point[1], point[0]),
          Math.acos(point[2]/dist)
        ];
    },

    /**
     * Converts an angle in degrees to radians.
     * @param  {number} degrees
     * @return {number}
     */
    radians: function(degrees) {
      return degrees/360*KraGL.Math.TAU;
    },

    /**
     * Gets the sign of some number.
     * @param  {number} x
     * @return {int}
     *         0: 0
     *         -1: negative
     *         1: positive
     */
    sign: function(x) {
      if(x === 0)
        return 0;
      return x/Math.abs(x);
    },

    /**
     * Return 0 if x < edge. Else 1.
     * @param  {number} edge
     * @param  {number} x
     * @return {int}
     */
    step: function(edge, x) {
      if(x < edge)
        return 0;
      else
        return 1;
    },

    /**
     * Inverse of mix().
     * @param  {number} x
     * @param {number[]} range
     * @return {number}
     */
    unmix: function(x, range) {
      return (x - range[0])/(range[1] - range[0]);
    },

    /**
     * Wraps some value to lie in the range [min, max).
     * @param {number} x
     * @param {number[]} range
     * @return {number}
     */
    wrap: function(x, range) {
      var len = range[1] - range[0];

      var dx = (x - range[0]) % len;
      if(dx < 0)
        dx += len;

      return range[0] + dx;
    }
  };

});
