define('KraGL.Math', ['KraGL'], function() {
  'use strict';

  /**
   * @class Math
   * @memberof KraGL
   * @classdesc A singleton with a bunch of helpful geometric and GLSL
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
     * @param  {number} [tolerance=0]
     * @return {boolean}
     */
    approx: function(x, y, tolerance) {
      tolerance = tolerance || 0;
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
     * Creates a change of basis matrix from 3 axis vectors. The axis vectors
     * are assumed to be orthogonal to each other.
     * @param {vec3} a
     * @param {vec3} b
     * @param {vec3} c
     * @return {mat3}
     */
    matChangeBasis: function(a, b, c) {
      return [
        a[0], a[1], a[2],
        b[0], b[1], b[2],
        c[0], c[1], c[2]
      ];
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
     * Rotates a point counter-clockwise around an axis.
     * @param  {vec4} p
     *         The point to be rotated.
     * @param  {vec3} [axis=[0,0,1]]
     *         The unit vector for the rotation axis.
     * @param  {number} angle
     *         The angle, in radians.
     * @return {vec4}
     *         The rotated point.
     */
    rotate: function(p, axis, angle) {
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
     * Rotates a point counter-clockwise around the positive Z axis.
     * @param  {vec3} p
     *         The point to be rotated.
     * @param  {number} angle
     *         The angle, in radians.
     * @return {vec3}
     *         The rotated point.
     */
    rotate2D: function(p, angle) {
      var m = mat3.fromRotation([], angle);
      return vec3.transformMat3([], p, m);
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
     * Scales a point relative to the origin.
     * @param  {vec4} p
     * @param  {(number|vec3)} s
     * @return {vec4}
     */
    scale: function(p, s) {
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
     * @param  {(number|vec2)} s
     * @return {vec3}
     */
    scale2D: function(p, s) {
      if(!_.isArray(s))
        s = [s,s];

      return [
        p[0] * s[0],
        p[1] * s[1],
        p[2]
      ];
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
     * Returns the result of a point translated by some vector.
     * @param  {vec4} p
     * @param  {vec3} v
     * @return {vec4}
     */
    translate: function(p, v) {
      var result = vec4.add([], p, v);
      result[3] = p[3];
      return result;
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
     * Checks if two vectors are parallel.
     * @param {vec3} u
     * @param {vec3} v
     * @param {number} tolerance
     * @return {boolean}
     */
    vecParallel: function(u, v, tolerance) {
      var sin = vec3.length(vec3.cross([], u, v));
      return KraGL.Math.approx(sin, 0, tolerance);
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
