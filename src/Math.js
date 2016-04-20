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
     * Orients a vector to point away from a surface as defined by its normal.
     * Returns n if dot(nRef, i) < 0. Else -n.
     * This is usually used to determine if a plane is front-facing or
     * back-facing from a particular view direction.
     * See: https://www.opengl.org/sdk/docs/man/html/faceforward.xhtml
     * @param  {vec3} n
     *         The first surface normal vector.
     * @param  {vec3} i
     *         The incident vector.
     * @param  {vec3} nRef
     *         The other surface normal vector. (I guess somehow our surface
     *         has two normals???)
     * @return {vec3}
     */
    faceforward: function(n, i, nRef) {
      if(nRef.dot(i) < 0)
        return n;
      else {
        return vec3.negate([], n);
      }
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
      return this.mix(range[0], range[1], alpha);
    },

    /**
     * Creates a change of basis matrix.
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
     * Creates a quaternion that can be used to produce a rotation from
     * u to v.
     * @param  {vec3} u
     * @param  {vec3} v
     * @return {quat}
     */
    quatFromTo: function(u, v) {
      u = this.vec3(u);
      v = this.vec3(v);

      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      var theta = Math.acos(vec3.dot(uHat, vHat));
      var n = vec3.cross([], u, v);

      return quat.setAxisAngle([], n, theta);
    },

    /**
     * Creates a quaternion for changing from one orientation to another.
     * @param  {vec3} fromX
     *         The starting X axis
     * @param  {vec3} fromY
     *         The starting y axis
     * @param  {vec3} toX
     *         The ending x axis
     * @param  {vec3} toY
     *         The ending y axis
     * @return {quat}
     */
    quatOrient: function(fromX, fromY, toX, toY) {
      var q1 = this.quatFromTo(fromX, toX);

      var q1Y = vec3.transformFromQuat([], fromY, q1);
      var q2 = this.quatFromTo(q1Y, toY);
      return quat.mul([], q2, q1);
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
      return vec3.sub([], vec3.scale([], n, scalar));
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
      var k = 1 - eta*eta * (1 - dotNI*dotNI);
      if(k < 0)
        return [0, 0, 0];
      else {
        var scaledI = vec3.scale([], i, eta);
        var scaledN = vec3.scale([], n, eta*dotNI + Math.sqrt(k));
        return vec3.sub([], scaledI, scaledN);
      }
    },

    /**
     * Returns the result of some point rotated CCW about some axis by some
     * angle in radians.
     * @param  {vec4} p
     * @param  {vec3} [axis=[0,0,1]]
     * @param  {number} angle
     * @return {vec4}
     */
    rotate: function(p, axis, angle) {
      if(!isNaN(axis)) {
        angle = axis;
        axis = [0,0,1];
      }
      var q = quat.setAxisAngle(axis, angle);
      return vec4.transformFromQuat([], p, q);
    },

    /**
     * Returns the result of some point scaled either uniformly by some
     * constant or component-wise by some vector.
     * @param  {vec4} p
     * @param  {(number|vec3)} s
     * @return {vec4}
     */
    scale: function(p, s) {
      if(!isNaN(s)) {
        s = [s,s,s];
      }

      return [
        p[0] * s[0],
        p[1] * s[1],
        p[2] * s[2],
        p[3]
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
      return x/Math.abs(x);
    },

    /**
     * Performs the smooth Hermite interpolation between 0 and 1
     * when x is in some exclusive range.
     * See: https://www.opengl.org/sdk/docs/man/html/smoothstep.xhtml
     * @param  {number} x
     * @param {number[]} range
     * @return {number}
     */
    smoothstep: function(x, range) {
      if(range[0] > range[1])
        return undefined;

      var t = this.clamp(this.unmix(x, range), 0, 1);
      return t*t*(3-2*t);
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
     * Converts a point in polar (spherical) coordinates to Cartesian coordinates.
     * The result is a homogenous 3D point.
     * @param  {vec3} point
     * @return {vec4}
     */
    toCartesian: function(point) {
      point[2] = point[2] || 0;

      var r = point[0];
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
     * Converts a point in Cartesian coordinates to polar
     * (actually 3D spherical) coordinates.
     * @param  {(vec3|vec4)} point
     * @return {vec3}
     */
    toPolar: function(point) {
      point[2] = point[2] || 0;
      var dist = vec3.dist(point, [0,0,0]);

      return [
        dist,
        Math.atan2(point[1], point[0]),
        Math.acos(point[2]/dist)
      ];
    },

    /**
     * Creates a vec2 from some other vector.
     * Undefined values default to 0.
     * @param  {(vec2|vec3|vec4)} u
     * @return {vec2}
     */
    toVec2: function(u) {
      return [
        u[0] || 0,
        u[1] || 0
      ];
    },

    /**
     * Creates a vec3 from some other vector.
     * Undefined values default to 0.
     * @param  {(vec2|vec3|vec4)} u
     * @return {vec3}
     */
    toVec3: function(u) {
      return [
        u[0] || 0,
        u[1] || 0,
        u[2] || 0
      ];
    },

    /**
     * Creates a vec4 from some other vector.
     * Undefined values default to 0.
     * @param  {(vec2|vec3|vec4)} u
     * @return {vec4}
     */
    toVec4: function(u) {
      return [
        u[0] || 0,
        u[1] || 0,
        u[2] || 0,
        u[3] || 0
      ];
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
     * Computes the unit vector parametrically rotated between two vectors.
     * @param  {vec3} u
     * @param  {vec3} v
     * @param  {number} a
     *         The parametric value
     * @return {vec3}
     */
    tweenVector: function(u, v, a) {
      u = this.toVec3(u);
      v = this.toVec3(v);

      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      var n = vec3.cross([], u, v);
      var nLen = vec3.length(n);

      // If the cross product's length is 0, then u and v are already in the
      // same direction. So just return uHat.
      if(nLen === 0)
        return _.clone(uHat);

      var theta = Math.acos(vec3.dot(uHat, vHat))*a;
      var q = quat.setAxisAngle([], n, theta);
      return vec3.transformFromQuat([], uHat, q);
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
     * @return {boolean}
     */
    vecParallel: function(u, v) {
      u = this.toVec3(u);
      v = this.toVec3(v);

      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      var sin = vec3.length(vec3.cross(uHat, vHat));
      return sin === 0;
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
